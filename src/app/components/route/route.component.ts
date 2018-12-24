import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AgmMap } from '@agm/core';

declare var google: any;

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
  map: AgmMap;
  lat: -33.8688;
  lng: 151.2195;
  mode: string;

  originPlaceId: any;
  destinationPlaceId: any;

  @ViewChild('originaInput') originaInput: ElementRef;
  @ViewChild('destinationInput') destinationInput: ElementRef;

  directionsService: any;
  directionsDisplay: any;
  constructor() {
    this.mode = 'DRIVING';
  }

  mapReady(map): void {
    // debugger;
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;

    const originInput = this.originaInput.nativeElement;
    const destinationInput = this.destinationInput.nativeElement;

    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.directionsDisplay.setMap(map);

    var originAutocomplete = new google.maps.places.Autocomplete(originInput, {
      placeIdOnly: true
    });
    var destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput,
      { placeIdOnly: true }
    );

    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
  }

  radioButtonChange() {
    debugger;
    this.route();
  }

  setupPlaceChangedListener(autocomplete, mode) {
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
      if (!place.place_id) {
        window.alert('Please select an option from the dropdown list.');
        return;
      }
      if (mode === 'ORIG') {
        this.originPlaceId = place.place_id;
      } else {
        this.destinationPlaceId = place.place_id;
      }
      this.route();
    });
  }

  route(): void {
    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }

    this.directionsService.route(
      {
        origin: { placeId: this.originPlaceId },
        destination: { placeId: this.destinationPlaceId },
        travelMode: this.mode
      },
      function(response, status) {
        if (status === 'OK') {
          this.directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }

  ngOnInit() {}
}
