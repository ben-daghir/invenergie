#include "DHT.h"
#include "ESP8266WiFi.h"
#include "ESP8266HTTPClient.h"
#include "ArduinoJson.h"

// WiFi credentials.
const char* WIFI_SSID = "Benjamin's iPhone";
const char* WIFI_PASS = "benguest";


#define DHTPIN 2     // what digital pin we're connected to
#define RESETPIN 16
#define DHTTYPE DHT11   // DHT 11

DHT dht(DHTPIN, DHTTYPE); // Initialize DHT sensor.

//Recursive Saftey
int stackCount = 0;
int stackCount2 = 0;

void setup() {
  
  Serial.begin(115200);
   
  connection();

  //Temp Read Begin
  dht.begin();

  jsonEncoder(stackCount);
  Serial.println("Entering deep sleep for 60 seconds");
  //ESP.deepSleep(60e6);
}

void connection() {
  //pinMode(LED_BUILTIN, OUTPUT); 

  //Wifi Connect
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_BUILTIN, LOW);
    delay(100);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
    Serial.print(" . ");
  }
   digitalWrite(LED_BUILTIN, LOW);
   delay(2500);
   digitalWrite(LED_BUILTIN, HIGH);

  //print a new line, then print WiFi connected and the IP address
  Serial.println("");
  Serial.println("WiFi connected");
  //Print the IP address
  Serial.println(WiFi.localIP());
}

float ts[3]; //farenheight
float hs[3]; //farenheight
int attempt = 0;
float diff1;
float diff2;
float diff3;
float t;
float h;
float hi;
char JSONmessageBuffer[300];

//JSON
StaticJsonBuffer<200> jsonBuffer;
JsonObject& environment = jsonBuffer.createObject();

void jsonEncoder(int stackCount) {
  if (stackCount > 3) {
    environment["date"] = "2018-04-24";
    //environment["time"] = "ADD LATER";
    environment["temp"] = -1;
    environment["humidity"] = -1;
    environment["heatindex"] = -1;
    environment["error"] = "Exceeded Stack Calls"; 
  } else {
    Serial.print("Stack Attempt: "); Serial.println(stackCount);
    for (int x = 0; x < 3; x++) {
       delay(2000);
       hs[x] = dht.readHumidity();
       // Read temperature as Celsius (the default) do readTemperature(true) for farenheight
       ts[x] = dht.readTemperature(true);
  
      // Check if any reads failed and exit early (to try again).
      attempt = 0;
      while (isnan(hs[x]) || isnan(ts[x])) {
        hs[x] = dht.readHumidity();
        // Read temperature as Celsius (the default)
        ts[x] = dht.readTemperature(true);
        attempt++;
        if (attempt > 5) {
          Serial.println("Sensor Failed");
          jsonEncoder(++stackCount);
          return;
        }
      }
      Serial.print("Humidity: ");
      Serial.print(hs[x]);
      Serial.print(" %\t");
      Serial.print("Temperature: ");
      Serial.println(ts[x]);
    }
  
    //Check data consistency
    diff1 = abs(ts[0] - ts[1]); 
    diff2 = abs(ts[0] - ts[2]); 
    diff3 = abs(ts[1] - ts[2]); 
    if (diff1 > 0.5 || diff2 > 0.5 || diff3 > 0.5) {
      Serial.println("Failed Temperature Consistency");
      jsonEncoder(++stackCount);
      return;     
    }
    diff1 = abs(hs[0] - hs[1]); 
    diff2 = abs(hs[0] - hs[2]); 
    diff3 = abs(hs[1] - hs[2]); 
    if (diff1 > 2 || diff2 > 2 || diff3 > 2) {
      Serial.println("Failed Humidity Consistency");
      jsonEncoder(++stackCount);
      return;
    }
    t = (ts[0] + ts[1] + ts[2]) / 3;
    h = (hs[0] + hs[1] + hs[2]) / 3;
  
    // Compute heat index in Celsius (isFahreheit = false)
    hi = dht.computeHeatIndex(t, h, true);
  
    Serial.print("Humidity: ");
    Serial.print(h);
    Serial.print(" % ");
    Serial.print("Temperature: ");
    Serial.print(t);
    Serial.print(" *F ");
    Serial.print("Heat index: ");
    Serial.print(hi);
    Serial.println(" *F ");
  
    //Creating the JSON
    environment["date"] = "2018-04-24";
    //environment["time"] = "ADD LATER";
    environment["temp"] = t;
    environment["humidity"] = h;
    environment["heatindex"] = hi;
 
    
  }
  stackCount = 0;
  
  environment.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    
  Serial.println(JSONmessageBuffer);
  
  httpPost(JSONmessageBuffer, stackCount2);
}


HTTPClient http;

void httpPost(String jsonMessage, int stackCount2) {
  if (stackCount2 < 3) {
    if(stackCount2 == 0) {
      http.begin("http://165.227.119.220:80/");
    }
    Serial.print("Beginning Client Session . . .");
    Serial.println(stackCount2);
    delay(5000);
    
    http.addHeader("Content-Type", "application/json");
    int httpCode = http.POST(jsonMessage);
    
    if(httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);
      // file found at server
      if(httpCode == HTTP_CODE_OK) {
        String payload = http.getString();
        Serial.println(payload);
        http.end();
       }
     } else {
              Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
              delay(2000);
              httpPost(jsonMessage, ++stackCount2);
              return;
     }
  } else {
    http.end();
    Serial.println("Upload Failed");
  }
  
}

void loop() {
  //Serial.println("Entering deep sleep for 60 seconds");
  //ESP.deepSleep(50000); //
  //Serial.println("Awakening from deep sleep");
  delay(60000);
  jsonEncoder(stackCount);
  // Wait a few seconds between measurements.
}
