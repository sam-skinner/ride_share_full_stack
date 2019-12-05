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
        { text: "Date", value: "date" },
        { text: "Time", value: "time" },
        { text: "From", value: "from_location_id" },
        { text: "To", value: "to_location_id" },
        { text: "Distance", value: "distance" },
        { text: "Fee", value: "fee" },
        { text: "Action", value: "action" }
      ],
      rides: [],
      
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
    this.$axios.get("/rides").then(response => {
      this.rides = response.data.map(ride => ({
        id: ride.id,
        date: ride.date,
        time: ride.time,
        distance: ride.distance,
        fuel_price: ride.fuel_price,
        fee: ride.fee,
        vehicle_id: ride.vehicle_id,
        from_location_id: ride.from_location_id,
        to_location_id: ride.to_location_id
      }));
    });
  },
  
  methods: {
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
      this.$axios.get("/rides").then(response => {
        this.ride = response.data.map(ride => ({
          id: ride.id,
          date: ride.date,
          time: ride.time,
          distance: ride.distance,
          fuel_price: ride.fuel_price,
          fee: ride.fee,
          vehicle_id: ride.vehicle_id,
          from_location_id: ride.from_location_id,
          to_location_id: ride.to_location_id
        }));
      });      
      this.rideDialog.show = false;
    }
  }
};
</script>