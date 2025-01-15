import { Component, OnDestroy } from "@angular/core";
import {
  Subscription,
  HyperTrack,
  HyperTrackError,
  LocationError,
  Location,
  LocationWithDeviation,
  Result,
  OrderStatus,
  Order,
} from "hypertrack-sdk-ionic-capacitor";
import { AlertController, Platform } from "@ionic/angular";
import { ChangeDetectorRef } from "@angular/core";

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
  ordersSubscription: Subscription;
  errorsText = "N/A";
  isTrackingText = "N/A";
  isAvailableText = "N/A";
  locationText = "N/A";
  ordersText = "N/A";

  constructor(
    private alertController: AlertController,
    public platform: Platform,
    private changeRef: ChangeDetectorRef
  ) {
    platform.ready().then((readySource) => {
      console.log("Platform ready", readySource);
      this.initialize(platform);
    });
  }

  async initialize(platform: Platform) {
    try {
      this.deviceId = await HyperTrack.getDeviceId();
      console.log("getDeviceId", this.deviceId);

      const name = "Quickstart Ionic Capacitor";
      HyperTrack.setName(name);
      console.log("setName", name);

      const metadata = {
        /**
         * Metadata is an custom data that is linked to the device.
         */
        source: name,
        employee_id: Math.round(Math.random() * 10000),
      };
      HyperTrack.setMetadata(metadata);
      console.log("setMetadata", metadata);

      let platformName = "";
      if (platform.is("android")) {
        platformName = "android";
      } else if (platform.is("ios")) {
        platformName = "ios";
      }
      /**
       * Worker handle is used to link the device and the worker.
       * You can use any unique user identifier here.
       * The recommended way is to set it on app login in set it to null on logout
       * (to remove the link between the device and the worker)
       **/
      HyperTrack.setWorkerHandle(
        `test_worker_quickstart_ionic_capacitor_${platformName}`
      );
      console.log("workerHandle is set");

      const workerHandle = await HyperTrack.getWorkerHandle();
      console.log("getWorkerHandle", workerHandle);

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
        this.changeRef.detectChanges();
      });

      HyperTrack.subscribeToOrders((orders) => {
        console.log("orders listener", orders);
        this.ordersText = getOrdersResponseText(orders);
        this.changeRef.detectChanges();
      });

      this.changeRef.detectChanges();
    } catch (error) {
      console.log("Error", error);
    }
  }

  async addGeotag() {
    let orderHandle = "test_order";
    let orderStatus: OrderStatus = {
      type: "orderStatusCustom",
      value: "test_status",
    };
    let data = {
      geotag: "data",
    };
    let result = await HyperTrack.addGeotag(orderHandle, orderStatus, data);
    let resultText = getLocationResponseText(result);
    console.log("Geotag:", resultText);
    this.showAlert("Geotag", resultText);
  }

  async addGeotagWithExpectedLocation() {
    let orderHandle = "test_order";
    let orderStatus: OrderStatus = {
      type: "orderStatusCustom",
      value: "test_status",
    };
    let data = {
      geotag: "data",
      withExpectedLocation: "true",
    };
    let expectedLocation = {
      latitude: 37.33182,
      longitude: -122.03118,
    };
    let result = await HyperTrack.addGeotag(
      orderHandle,
      orderStatus,
      data,
      expectedLocation
    );
    let resultText = getLocationWithDeviationResponseText(result);
    console.log("Geotag with expected location:", resultText);
    this.showAlert("Geotag with expected location", resultText);
  }

  async getAllowMockLocation() {
    const allowMockLocation = await HyperTrack.getAllowMockLocation();
    console.log("allowMockLocation", allowMockLocation);
    this.showAlert("allowMockLocation", `${allowMockLocation}`);
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

  async getOrders() {
    let result = await HyperTrack.getOrders();
    console.log("Orders:", result);
    this.showAlert("Orders", getOrdersResponseText(result));
  }

  async locate() {
    HyperTrack.locate((locationResult: Result<Location, HyperTrackError[]>) => {
      let result = getLocateResponseText(locationResult);
      console.log("Locate:", result);
      this.showAlert("Locate:", result);
    });
    console.log("Locate started");
  }

  async setAllowMockLocation(allowMockLocation: boolean) {
    HyperTrack.setAllowMockLocation(allowMockLocation);
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

function getLocationErrorResponseText(locationError: LocationError) {
  switch (locationError.type) {
    case "notRunning":
      return "Not running";
    case "starting":
      return "Starting";
    case "errors":
      return `Errors:\n${getErrorsText(locationError.value)}`;
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
      return getLocationErrorResponseText(response.value);
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
      return getLocationErrorResponseText(response.value);
  }
}

function getOrdersResponseText(orders: Map<string, Order>) {
  if (orders.size === 0) {
    return "No orders";
  } else {
    return Array.from(orders)
      .map(([_, order]) => {
        let isInsideGeofenceText: string;
        switch (order.isInsideGeofence.type) {
          case "success":
            isInsideGeofenceText = order.isInsideGeofence.value.toString();
            break;
          case "failure":
            isInsideGeofenceText = getLocationErrorResponseText(
              order.isInsideGeofence.value
            );
            break;
        }
        return `Order: ${order.orderHandle}\nIsInsideGeofence: ${isInsideGeofenceText}`;
      })
      .join("\n");
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
