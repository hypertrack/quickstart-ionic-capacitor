import { Component, OnDestroy } from "@angular/core";
import {
  Subscription,
  HyperTrack,
  HyperTrackError,
  LocationError,
  Location,
  LocationWithDeviation,
  Result,
} from "hypertrack-sdk-ionic-capacitor";
import { AlertController } from "@ionic/angular";
import { ChangeDetectorRef } from "@angular/core";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnDestroy {
  deviceId = "N/A";
  errorsSubscription: Subscription;
  isTrackingSubscription: Subscription;
  isAvailableSubscription: Subscription;
  locationSubscription: Subscription;
  errorsText = "N/A";
  isTrackingText = "N/A";
  isAvailableText = "N/A";
  locationText = "N/A";

  constructor(
    private alertController: AlertController,
    public platform: Platform,
    private changeRef: ChangeDetectorRef
  ) {
    platform.ready().then((readySource) => {
      console.log("Platform ready", readySource);
      this.initialize();
    });
  }

  async initialize() {
    try {
      this.deviceId = await HyperTrack.getDeviceId();
      console.log(`Device Id: ${this.deviceId}`);

      let name = "Quickstart Ionic";
      console.log("Setting name to", name);
      HyperTrack.setName(name);

      let metadata = {
        source: name,
        value: Math.random(),
      };
      console.log("Setting metadata to", JSON.stringify(metadata));
      HyperTrack.setMetadata(metadata);

      HyperTrack.subscribeToErrors((errors: HyperTrackError[]) => {
        let result = getErrorsText(errors);
        console.log("Listener errors: ", result);
        this.errorsText = result;
        this.changeRef.detectChanges();
      });

      HyperTrack.subscribeToIsTracking((isTracking) => {
        console.log("isTracking listener", isTracking);
        this.isTrackingText = JSON.stringify(isTracking);
        this.changeRef.detectChanges();
      });

      HyperTrack.subscribeToIsAvailable((isAvailable) => {
        console.log("isAvailable listener", isAvailable);
        this.isAvailableText = JSON.stringify(isAvailable);
        this.changeRef.detectChanges();
      });

      HyperTrack.subscribeToLocation((locationResult) => {
        console.log("location listener", locationResult);
        this.locationText = getLocationResponseText(locationResult);
        console.log("location listener", location);
        this.changeRef.detectChanges();
      });

      this.changeRef.detectChanges();
    } catch (error) {
      console.log("Error", error);
    }
  }

  async addGeotag() {
    let data = {
      geotag: "data",
    };
    let result = await HyperTrack.addGeotag(data);
    let resultText = getLocationResponseText(result);
    console.log("Geotag:", resultText);
    this.showAlert("Geotag", resultText);
  }

  async addGeotagWithExpectedLocation() {
    let data = {
      geotag: "data",
      withExpectedLocation: "true",
    };
    let expectedLocation = {
      latitude: 37.33182,
      longitude: -122.03118,
    };
    let result = await HyperTrack.addGeotag(data, expectedLocation);
    let resultText = getLocationWithDeviationResponseText(result);
    console.log("Geotag with expected location:", resultText);
    this.showAlert("Geotag with expected location", resultText);
  }

  async getErrors() {
    let errors = await HyperTrack.getErrors();
    let result = getErrorsText(errors);
    console.log("Errors:", result);
    this.showAlert("errors", result);
  }

  async getIsAvailable() {
    const available = await HyperTrack.getIsAvailable();
    console.log("isAvailable", available);
    this.showAlert("isAvailable", `${available}`);
  }

  async getIsTracking() {
    const isTracking = await HyperTrack.getIsTracking();
    console.log("isTracking", isTracking);
    this.showAlert("isTracking", `${isTracking}`);
  }

  async getLocation() {
    const result = await HyperTrack.getLocation();
    this.showAlert("Location:", getLocationResponseText(result));
  }

  async getMetadata() {
    const metadata = await HyperTrack.getMetadata();
    console.log("Metadata:", metadata);
    this.showAlert("Metadata", JSON.stringify(metadata));
  }

  async getName() {
    const name = await HyperTrack.getName();
    console.log("Name:", name);
    this.showAlert("Name", name);
  }

  async locate() {
    HyperTrack.locate((locationResult: Result<Location, HyperTrackError[]>) => {
      let result = getLocateResponseText(locationResult);
      console.log("Locate:", result);
      this.showAlert("Locate:", result);
    });
    console.log("Locate started");
  }

  async setIsAvailable(isAvailable: boolean) {
    HyperTrack.setIsAvailable(isAvailable);
  }

  async setIsTracking(isTracking: boolean) {
    HyperTrack.setIsTracking(isTracking);
  }

  async showAlert(header: string, message: string) {
    console.log(message);
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  ngOnDestroy(): void {}
}

function getLocateResponseText(response: Result<Location, HyperTrackError[]>) {
  switch (response.type) {
    case "success":
      return `Location: ${JSON.stringify(
        [response.value.latitude, response.value.longitude],
        null,
        4
      )}`;
    case "failure":
      return `Errors:\n${getErrorsText(response.value)}`;
  }
}

function getLocationResponseText(
  response: Result<Location, LocationError>
): string {
  switch (response.type) {
    case "success":
      return `Location: ${JSON.stringify(
        [response.value.latitude, response.value.longitude],
        null,
        4
      )}`;
    case "failure":
      switch (response.value.type) {
        case "notRunning":
          return "Not running";
        case "starting":
          return "Starting";
        case "errors":
          return `Errors:\n${getErrorsText(response.value.value)}`;
      }
    default:
      return `Unknown response: $response`;
  }
}

function getLocationWithDeviationResponseText(
  response: Result<LocationWithDeviation, LocationError>
) {
  switch (response.type) {
    case "success":
      return `Location: ${JSON.stringify(
        [response.value.location.latitude, response.value.location.longitude],
        null,
        4
      )}\nDeviation: ${response.value.deviation}`;
    case "failure":
      switch (response.value.type) {
        case "notRunning":
          return "Not running";
        case "starting":
          return "Starting";
        case "errors":
          return `Errors:\n${getErrorsText(response.value.value)}`;
      }
  }
}

function getErrorsText(errors: HyperTrackError[]) {
  if (errors.length === 0) {
    return "No errors";
  } else {
    return errors
      .map((error) => {
        if (typeof error === "string") {
          return error as string;
        } else {
          return `Failed to parse error: ${JSON.stringify(error)}`;
        }
      })
      .join("\n");
  }
}
