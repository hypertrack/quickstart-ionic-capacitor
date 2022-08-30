import { Component, OnDestroy } from '@angular/core';
import { Blocker, HyperTrack, HyperTrackSdkInstance } from 'hypertrack-capacitor-plugin';
import { AlertController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core'
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  publishableKey: string = 'jNvgqDgY_j3yj-OwbTQtVcCoVGMOLkmllgV7KUtElL5j3g3nGwNEpLzdOO88KZ1E6rkeGmH7b9spUSFIYM5SkQ'; //'YOUR-PUBLISHABLE-KEY-HERE';
  blockerList: Blocker[] = [];
  hypertrackInstance: HyperTrackSdkInstance;
  deviceId: Record<string, string> = {};
  status: string = 'NA';
  stateChangeListner;
  error: string = 'NA';
  location = 'NA';
  isTracking;
  availabilityStateChange;
  constructor(private alertController: AlertController, private changeRef: ChangeDetectorRef) {
    HyperTrack.enableDebugLogging();
    this.initialize();
  }

  async initialize() {
    try {
      await this.getBlocker();
      const result = await HyperTrack.ininitialize(this.publishableKey);
      this.hypertrackInstance = result.hyperTrackInstance;
      await this.getDeviceId();
      await this.addTrackingListener();
      await this.hypertrackInstance.setDeviceName({ name: 'Quickstart Ionic' });
      this.isTracking = await this.isTrackingStatus()
      if (this.isTracking === true) {
        this.status = 'Tracking has started...';
      } else if (this.isTracking === false) {
        this.status = `Tracking hasn't started...`;
      }
      this.changeRef.detectChanges();
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async getBlocker() {
    try {
      this.blockerList = await HyperTrack.getBlockers();
      if (this.blockerList.length > 0) {
        this.blockerList.forEach(element => {
          element.resolve();
        });
      }
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async start() {
    try {

      await this.getBlocker();
      await this.hypertrackInstance.start();
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async stop() {
    try {
      const isTracking = await this.isTrackingStatus();
      if (isTracking) {
        await this.hypertrackInstance.stop();
      }
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async getDeviceId() {
    try {
      this.deviceId = await this.hypertrackInstance.getDeviceId();
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async addTrackingListener() {
    try {
      await this.hypertrackInstance.addTrackingListener();
      await this.getTrackingStateChange();
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async getTrackingStateChange() {
    this.stateChangeListner = await this.hypertrackInstance.addListener(
      'trackingStateChange',
      (info: any) => {
        if (info.status === 'start') {
          this.status = 'Tracking has started...';
        } else if (info.status === 'stop') {
          this.status = 'Tracking has stopped...';
        } else if (info.error) {
          console.log(info.error);
          this.status = JSON.stringify(info.error);
        }
        this.changeRef.detectChanges();
      }
    );
  }

  getLatestLocation() {
    this.isTrackingStatus().then((status) => {
      if (status) {
        this.hypertrackInstance.getLatestLocation((res, err) => {
          if (res) {
            this.location = JSON.stringify(res.location);
            this.changeRef.detectChanges();
          } else {
            console.log(err);
            this.showAlert('Error', err);
          }
        });
      }
    });
  }

  async isTrackingStatus() {
    try {
      const res = await this.hypertrackInstance.isTracking();
      return res.status;
    } catch (error) {
      this.showAlert('Error', error);
    }
  }

  async mockLocations() {
    try {
      await this.hypertrackInstance.allowMockLocations();
      this.showAlert('Message', 'Mock Locations allowed');
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async addGeoTag() {
    try {
      const geoTagObj = {
        metadata: { "orderId": "ABC00001" },
        coordinates: { latitude: 26.922070, longitude: 75.778885 }
      };
      await this.hypertrackInstance.addGeotag(geoTagObj);
      this.showAlert('Message', JSON.stringify(geoTagObj));
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async setAvailability() {
    try {
      await this.hypertrackInstance.setAvailability({ isAvailable: true });
      this.showAlert('Message', JSON.stringify({ isAvailable: true }));
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async getAvailability() {
    try {
      const res = await this.hypertrackInstance.getAvailability();
      this.showAlert('Availability', JSON.stringify(res));
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async setTrackingNotificationProperties() {
    try {
      const propertiesObj = { title: "Tracking On", message: "Ionic SDK is tracking" };
      await this.hypertrackInstance.setTrackingNotificationProperties(propertiesObj);
      this.showAlert('Notification properties changed', JSON.stringify(propertiesObj));
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async requestPermissions() {
    try {
      await this.hypertrackInstance.requestPermissionsIfNecessary();
      this.showAlert('Message', 'requestPermissionsIfNecessary called');
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async removeAvailabilityListener() {
    try {
      await this.hypertrackInstance.removeAvailabilityListener();
      this.availabilityStateChange.remove();
      this.showAlert('Message', 'addAvailability Listener removed');
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async addAvailabilityListener() {
    try {
      await this.hypertrackInstance.addAvailabilityListener();
      this.getAvailabilityStateChange();
      this.showAlert('Message', 'addAvailability Listener added');
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async syncDevice() {
    try {
      await this.hypertrackInstance.syncDeviceSettings();
      this.showAlert('Message', 'syncDevice called');
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async setMetadata() {
    try {
      await this.hypertrackInstance.setDeviceMetadata({ appName: "quickstart-ionic-capacitor", appVersion: "1.0.0" });
      this.showAlert('Data set successfully', JSON.stringify({ appName: "quickstart-ionic-capacitor", appVersion: "1.0.0" }));
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async getAvailabilityStateChange() {
    this.availabilityStateChange = await this.hypertrackInstance.addListener(
      'availabilityStateChange',
      (info: any) => {
        this.showAlert('Availability State', JSON.stringify(info));
      }
    );
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  
  ngOnDestroy() {
    this.hypertrackInstance.removeTrackingListener().then(() => {
      this.stateChangeListner.remove();
    });
  }
}
