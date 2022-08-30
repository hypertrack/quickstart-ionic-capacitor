import { Component, OnDestroy } from '@angular/core';
import { Subscription, HyperTrack, HyperTrackError } from 'hypertrack-sdk-ionic-capacitor';
import { AlertController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular';

const PUBLISHABLE_KEY = "PUT_YOUR_PUBLISHABLE_KEY_HERE"

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  hyperTrack: HyperTrack;
  trackingSubscription: Subscription;
  availabilitySubscription: Subscription;
  errorsSubscription: Subscription;
  deviceId = 'N/A';
  isTrackingText = 'N/A';
  isAvailableText = 'N/A';
  errorsText = 'N/A';

  constructor(
    private alertController: AlertController,
    public platform: Platform,
    private changeRef: ChangeDetectorRef
  ) {
    platform.ready().then((readySource) => {
      console.log("Platform ready", readySource)
      this.initialize();
    })
  }

  async initialize() {
    try {
      console.log("Initializing HyperTrack")
      this.hyperTrack = await HyperTrack.initialize(
        PUBLISHABLE_KEY,
        { loggingEnabled: true }
      );
      console.log(this.hyperTrack)

      this.deviceId = await this.hyperTrack.getDeviceId();
      console.log(`Device Id: ${this.deviceId}`)

      let name = 'Quickstart Ionic'
      console.log("Setting name to", name)
      this.hyperTrack.setName(name);

      let metadata = {
        source: name,
        value: Math.random()
      }
      console.log("Setting metadata to", metadata)
      this.hyperTrack.setMetadata(metadata);

      this.hyperTrack.subscribeToTracking((isTracking) => { 
        console.log("isTracking listener", isTracking)
        this.isTrackingText = JSON.stringify(isTracking) 
        this.changeRef.detectChanges();
      });
      this.hyperTrack.subscribeToAvailability((isAvailable) => { 
        console.log("isAvailable listener", isAvailable)
        this.isAvailableText = JSON.stringify(isAvailable)
        this.changeRef.detectChanges();
       });
      this.hyperTrack.subscribeToErrors((errors) => { 
        const text = JSON.stringify(errors) 
        console.log("errors listener", errors, text)
        this.errorsText = text
        this.changeRef.detectChanges();
      });

      this.changeRef.detectChanges();
    } catch (error) {
      console.log("Error", error)
    }
  }

  async startHyperTrack() {
    this.hyperTrack.startTracking();
  }

  async stopHyperTrack() {
    this.hyperTrack.stopTracking();
  }

  async getAvailabilityStatus() {
    const res = await this.hyperTrack.isAvailable();
    this.showAlert('Message', res.toString());
  }

  async isTracking() {
    const res = await this.hyperTrack.isTracking();
    this.showAlert('Message', res.toString());
  }

  async syncDevice() {
    await this.hyperTrack.sync();
    this.showAlert('Message', 'sync called');
  }

  async addGeoTag() {
    let data = { "orderId": "ABC00001" };
    const result = await this.hyperTrack.addGeotag(data);
    this.showAlert('Message', `geotag result ${JSON.stringify(result)}`);
  }

  async getLocation() {
    const result = await this.hyperTrack.getLocation();
    this.showAlert('Message', `geotag result ${JSON.stringify(result)}`);
  }

  async setAvailability(value: boolean) {
    this.hyperTrack.setAvailability(value);
  }

  async showAlert(header: string, message: string) {
    console.log(message)
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  ngOnDestroy(): void {
  
  }
}
