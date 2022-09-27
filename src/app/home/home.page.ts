import { Component, OnDestroy } from '@angular/core';
import { Blocker, HyperTrack, HyperTrackSdkInstance } from 'hypertrack-capacitor-plugin';
import { AlertController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnDestroy {
  publishableKey: string = 'YOUR-PUBLISHABLE-KEY-HERE';
  blockerList: Blocker[] = [];
  hypertrackInstance: HyperTrackSdkInstance;
  deviceId: Record<string, string> = {};
  trackingStatus: boolean = false;
  trackingStateChangeListner;
  availabilityStatus: any = 'NA';
  availabilityStateChange;
  trackingStateChange: string = 'NA';
  constructor(private alertController: AlertController, private changeRef: ChangeDetectorRef,public platform: Platform) {
    HyperTrack.enableDebugLogging();
    this.initialize();
  }

  async initialize() {
    try {
      /* Blocker is not available for IOS */
      if (this.platform.is('android')) {
        await this.getBlocker();
      }
      const result = await HyperTrack.ininitialize(this.publishableKey);
      this.hypertrackInstance = result.hyperTrackInstance;
      await this.getDeviceId();
      await this.addTrackingListener();
      await this.addAvailabilityListener();
      await this.getAvailability();
      await this.hypertrackInstance.setDeviceName({ name: 'Quickstart Ionic' });
      this.trackingStatus = await this.isTrackingStatus()
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
      if (this.platform.is('android')) {
        await this.getBlocker();
      }
      await this.hypertrackInstance.start();
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async stop() {
    try {
      this.trackingStatus = await this.isTrackingStatus();
      if (this.trackingStatus) {
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
    this.trackingStateChangeListner = await this.hypertrackInstance.addListener(
      'trackingStateChange',
      (info: any) => {
        this.trackingStateChange = JSON.stringify(info);
        if (info.status === 'start') {
          this.trackingStatus = true;
        } else {
          this.trackingStatus = false;
        }
        this.changeRef.detectChanges();
      }
    );
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

  async setAvailability(value:boolean) {
    try {
      await this.hypertrackInstance.setAvailability({ isAvailable: value });
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async getAvailability() {
    try {
      const res = await this.hypertrackInstance.getAvailability();
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

  async addAvailabilityListener() {
    try {
      await this.hypertrackInstance.addAvailabilityListener();
      this.getAvailabilityStateChange();
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
        this.availabilityStatus = JSON.stringify(info);
        this.changeRef.detectChanges();
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
  
  async getAvailabilityStatus() {
    try {
      const result = await this.hypertrackInstance.getAvailability();
      this.showAlert('getAvailabilityStatus called', JSON.stringify(result));
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async isRunning() {
    try {
      const result = await this.hypertrackInstance.isRunning();
      this.showAlert('isRunning called', JSON.stringify(result));
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  async isTrackingMethod() {
    try {
      const result = await this.hypertrackInstance.isTracking();
      this.showAlert('isTracking called', JSON.stringify(result));
    } catch (error) {
      console.log(error);
      this.showAlert('Error', error);
    }
  }

  ngOnDestroy() {
    this.hypertrackInstance.removeTrackingListener().then(() => {
      this.trackingStateChangeListner.remove();
    });
    this.hypertrackInstance.removeAvailabilityListener().then(() => {
      this.availabilityStateChange.remove();
    });
  }
}
