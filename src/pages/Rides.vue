<template>
  <v-container>
    <div>      
      <!-- Header -->
      <v-toolbar>
        <v-layout justify-space-between>
          <v-flex shrink align-self-center>
            <v-toolbar-title>Rides</v-toolbar-title>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink justify-self-end>
            <v-btn color="primary" raised v-on:click.stop="addRide">Add Ride</v-btn>
          </v-flex>
        </v-layout>
      </v-toolbar>
      
      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="rides"
      >
        <template v-slot:item.action="{ item }">
          <td>
            <v-icon small class="ml-2" 
               @click="updateRide(item)">
              mdi-pencil
            </v-icon>
          </td>
        </template>
      </v-data-table>
      
      <!-- New/Edit dialog -->
      <v-dialog
        persistent
        scrollable
        v-model="rideDialog.show"
        max-width="500px"
      >
        <RidesForm
          v-bind:editMode="rideDialog.editMode"
          v-bind:initialData="rideDialog.ride"
          v-on:cancel="cancelRide"
          v-on:save="saveRide"
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
import RidesForm from "../components/RidesForm";

export default {
  name: "Rides",
  
  components: {
    RidesForm
  },
  
  data: function() {
    return {
      headers: [
        { text: "Date", value: "date", width: "13%" },
        { text: "Time", value: "time", width: "13%" },
        { text: "Driver", value: "drivers", width: "16%" },
        { text: "From", value: "from_location_name", width: "10%" },
        { text: "To", value: "to_location_name", width: "12%" },
        { text: "Passengers", value: "passengers"},
        { text: "Action", value: "action" }
      ],
      rides: [],
      locationList: [],
      drivers: [],
      
      rideDialog: {
        show: false,
        editMode: false,
        ride: {}
      },
      
      snackbar:{
        show: false,
        text: ""
      }
    }
  },
  
  mounted: function() {
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
                  passengers: this.findDriverInDrivers(this.findDriverWithRideId(ride.id, passengers), allPassengers)
                }));
              });
            });
          });
        });
      });
    });
    
  },
  
  methods: {
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
    // Display a snackbar message.
    showSnackbar(text) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },
    
    // Update ride information.
    updateRide(ride) {
      this.activateRideDialog({ ...ride }, true);
    },
    
    activateRideDialog(ride = {}, editMode = false) {
      this.rideDialog.editMode = editMode;
      this.rideDialog.ride = ride;
      this.rideDialog.show = true;
    },
    
    // Add a ride
    addRide() {
      this.activateRideDialog();
    },
    
    cancelRide() {
      this.rideDialog.show = false;
    },
    
    saveRide(ride) {
      this.$axios.get("/locations").then(response => {
        response.data.map(l => this.locationList.push(l));
        
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
                drivers: this.findDriverInDrivers(this.findDriverWithRideId(ride.id, drivers), allDrivers)
                // passengers: 
              }));
            });
          });
        });
      });
      this.rideDialog.show = false;
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
     },
  }
};
</script>