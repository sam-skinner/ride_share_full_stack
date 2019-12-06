<template>
  <v-container>
    <div>      
      <!-- Header -->
      <v-toolbar>
        <v-layout justify-space-between>
          <v-flex shrink align-self-center>
            <v-toolbar-title>Passenger</v-toolbar-title>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink justify-self-center>
            <v-combobox
              label="Select Passenger" 
              v-model="passenger"
              :items="passengers"
              item-text="passenger"
              item-value="id"
              hide-selected
              :search-input.sync="search"
            >
              <template slot='item' slot-scope='{ item }'>
                {{ item.first_name }} {{ item.last_name }}
              </template>
              <template v-slot:no-data>
                <v-list-item @click="addNewPassenger(search)">
                  <v-list-item-content>
                    <v-list-item-title>
                      Create "<strong>{{ search }}</strong>"?
                    </v-list-item-title>
                  </v-list-item-content>            
                </v-list-item>
              </template>
              <template v-slot:selection="{ attrs, item, parent, selected }">
                <span 
                  v-bind="attrs"
                  :input-value="selected">
                  {{ item.first_name }} {{ item.last_name }}
                </span>
              </template>
            </v-combobox>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink justify-self-end>
            <v-btn color="primary" raised v-on:click.stop="signUp(passenger)">Sign Up For a Ride</v-btn>
          </v-flex>
        </v-layout>
      </v-toolbar>

      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="showRides"
      >
      </v-data-table>
      
      <!-- Create Passenger dialog -->
      <v-dialog
        persistent
        scrollable
        v-model="passengerDialog.show"
        max-width="500px"
      >
        <PassengerForm
          v-bind:initialData="passengerDialog.passenger"
          v-on:cancel="cancelCreate"
          v-on:save="savePassenger"
        />
      </v-dialog>
      
      <v-dialog
        persistent
        scrollable
        v-model="signUpDialog.show"
        max-width="500px"
      >
        <RideSignUpForm
          v-bind:initialData="signUpDialog.passenger"
          v-on:cancel="cancelSignUpDialog"
          v-on:save="saveSignUp"
        />
      </v-dialog>
      
      <v-snackbar v-model="snackbar.show">
        {{ snackbar.text }}
        <v-btn color="blue" text @click="snackbar.show = false">
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import PassengerForm from "../components/PassengerForm";
import RideSignUpForm from "../components/RideSignUpForm";

export default {
  name: "Passenger",
  
  components: {
    PassengerForm,
    RideSignUpForm
  },
  
  data: function() {
    return {
      headers: [
        { text: "Date", value: "date", width: "13%" },
        { text: "Time", value: "time", width: "13%" },
        { text: "Driver", value: "drivers", width: "16%" },
        { text: "From", value: "from_location_name", width: "10%" },
        { text: "To", value: "to_location_name", width: "12%" },
        { text: "Passengers", value: "passengers"}
      ],
      
      rides: [],
      locationList: [],
      drivers: [],
      
      snackbar:{
        show: false,
        text: ""
      },
      
      passenger: {},
      passengers: [],
      search: null,
      
      passengerDialog: {
        show: false,
        passenger: {}
      },
      
      signUpDialog: {
        show: false,
        passenger: {}
      }
    }
  },
  
  computed: {
    showRides() {
      return this.rides.filter(ride => ride.passenger_id == this.passenger.id);
    }
  },
  
  mounted: function() {
    this.$axios.get("/passengers").then(response => {
      response.data.map(t => this.passengers.push(t));
    });
    
    this.$axios.get("/locations").then(response => {
      response.data.map(l => this.locationList.push(l));
      
      this.$axios.get("/passengers").then(response => {
        let allPassengers = response.data;

        this.$axios.get("/passengers-rides").then(response => {
          let passengers = response.data;

          this.$axios.get("/drivers").then(response => {
            let allDrivers = response.data;
            
            this.$axios.get("/drivers-rides").then(response => {
              let drivers = response.data;
              this.$axios.get("/rides").then(response => {
                this.rides = response.data.map(ride => ({
                  id: ride.id,
                  date: this.getDateFromTimestamp(ride.date),
                  time: ride.time.substring(0, 5),
                  distance: ride.distance,
                  fuel_price: ride.fuel_price,
                  fee: ride.fee,
                  vehicle_id: ride.vehicle_id,
                  from_location_id: ride.from_location_id,
                  to_location_id: ride.to_location_id,
                  to_location_name: this.findLocationById(ride.to_location_id, this.locationList).name,
                  from_location_name: this.findLocationById(ride.from_location_id, this.locationList).name,
                  drivers: this.findDriverInDrivers(this.findDriverWithRideId(ride.id, drivers), allDrivers),
                  passengers: this.findDriverInDrivers(this.findDriverWithRideId(ride.id, passengers), allPassengers),
                  passenger_id: this.findDriverWithRideId(ride.id, passengers)
                }));
              });
            });
          });
        });
      });
    });
  },
  
  methods: {
    // Display a snackbar message.
    showSnackbar(text) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },
    
    signUp(passenger) {
      this.activateSignUpDialog({ ...passenger });
    },
    
    saveSignUp() {
      this.$axios.get("/locations").then(response => {
        response.data.map(l => this.locationList.push(l));
        
        this.$axios.get("/passengers").then(response => {
          let allPassengers = response.data;

          this.$axios.get("/passengers-rides").then(response => {
            let passengers = response.data;

            this.$axios.get("/drivers").then(response => {
              let allDrivers = response.data;
              
              this.$axios.get("/drivers-rides").then(response => {
                let drivers = response.data;
                this.$axios.get("/rides").then(response => {
                  this.rides = response.data.map(ride => ({
                    id: ride.id,
                    date: this.getDateFromTimestamp(ride.date),
                    time: ride.time.substring(0, 5),
                    distance: ride.distance,
                    fuel_price: ride.fuel_price,
                    fee: ride.fee,
                    vehicle_id: ride.vehicle_id,
                    from_location_id: ride.from_location_id,
                    to_location_id: ride.to_location_id,
                    to_location_name: this.findLocationById(ride.to_location_id, this.locationList).name,
                    from_location_name: this.findLocationById(ride.from_location_id, this.locationList).name,
                    drivers: this.findDriverInDrivers(this.findDriverWithRideId(ride.id, drivers), allDrivers),
                    passengers: this.findDriverInDrivers(this.findDriverWithRideId(ride.id, passengers), allPassengers),
                    passenger_id: this.findDriverWithRideId(ride.id, passengers)
                  }));
                });
              });
            });
          });
        });
      });
      this.signUpDialog.show = false;
    },
    
    activateSignUpDialog(passenger = {}) {
      this.signUpDialog.passenger = passenger;
      this.signUpDialog.show = true;
    },
    
    cancelSignUpDialog() {
      this.signUpDialog.show = false;
    },
    
    addNewPassenger(newPassenger) {
      this.activatePassengerDialog({ ...newPassenger });
    },
    
    activatePassengerDialog(passenger = {}) {
      this.passengerDialog.passenger = passenger;
      this.passengerDialog.show = true;
    },
    
    cancelCreate() {
      this.passengerDialog.show = false;
    },
    
    savePassenger(passenger) {
      this.$axios.get("/passengers").then(response => {
        response.data.map(t => this.passengers.push(t));
      });
      this.passengerDialog.show = false;
    },
    
    findLocationById(id, myArray){
     for (var i=0; i < myArray.length; i++) {
         if (myArray[i].id === id) {
             return myArray[i];
         }
     }
    },
    
    findDriverWithRideId(id, myArray){
     for (var i=0; i < myArray.length; i++) {
         if (myArray[i].ride_id === id) {
             return myArray[i].driver_id == null ? myArray[i].passenger_id : myArray[i].driver_id;
         }
     }
    },
    
    findDriverInDrivers(id, myArray) {
      for (var i=0; i < myArray.length; i++) {
          if (myArray[i].id === id) {
              return myArray[i].first_name + " " + myArray[i].last_name;
          }
      }
    },
    
    getDateFromTimestamp(ts) {
      let date = new Date(ts);
      if (date.getTime() < 86400000) {
        //ms in a day
        return "";
      }
      let yr = date.toLocaleDateString(this.currentLanguageCode, {
        year: "numeric"
      });
      let mo = date.toLocaleDateString(this.currentLanguageCode, {
        month: "2-digit"
      });
      let da = date.toLocaleDateString(this.currentLanguageCode, {
        day: "2-digit"
      });
      return `${mo}-${da}-${yr}`;
    }
  }
};
</script>