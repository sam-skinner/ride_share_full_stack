<template>
  <v-container>
    <div>      
      <!-- Header -->
      <v-toolbar>
        <v-layout justify-space-between>
          <v-flex shrink align-self-center>
            <v-toolbar-title>Vehicles</v-toolbar-title>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink justify-self-end>
            <v-btn color="primary" raised v-on:click.stop="addVehicle">Add Vehicle</v-btn>
          </v-flex>
        </v-layout>
      </v-toolbar>
      
      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="vehicles"
      >
        <template v-slot:item.action="{ item }">
          <v-icon small class="ml-2" @click="updateVehicle(item)">
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
      
      <!-- New/Edit dialog -->
      <v-dialog
        persistent
        scrollable
        v-model="vehicleDialog.show"
        max-width="500px"
      >
        <VehiclesForm
          v-bind:editMode="vehicleDialog.editMode"
          v-bind:initialData="vehicleDialog.vehicle"
          v-bind:course="vehicle"
          v-on:cancel="cancelVehicle"
          v-on:save="saveVehicle"
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
import VehiclesForm from "../components/VehiclesForm";

export default {
  name: "Vehicles",
  
  components: {
    VehiclesForm
  },
  
  props: {
    vehicle: {
      type: Object,
      required: true
    }
  },
  
  data: function() {
    return {
      headers: [
        { text: "Make", value: "make" },
        { text: "Model", value: "model" },
        { text: "Color", value: "color" },
        { text: "State", value: "state" },
        { text: "License Number", value: "licenseNumber" }

      ],
      vehicles: [],
      
      vehicleDialog: {
        show: false,
        editMode: false,
        vehicle: {}
      },
      
      snackbar:{
        show: false,
        text: ""
      }
    }
  },
  
  mounted: function() {
    this.$axios.get("/vehicles").then(response => {
      this.vehicles = response.data.map(vehicle => ({
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
        state: vehicle.license_state,
        licenseNumber: vehicle.license_number
      }));
    });
  },
  
  methods: {
    // Display a snackbar message.
    showSnackbar(text) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },
    
    // Update vehicle information.
    updateVehicle(vehicle) {
      this.activateVehicleDialog({ ...vehicle }, true);
    },
    
    activateVehicleDialog(vehicle = {}, editMode = false) {
      this.vehicleDialog.editMode = editMode;
      this.vehicleDialog.vehicle = vehicle;
      this.vehicleDialog.show = true;
    },
    
    // Add a vehicle
    addVehicle() {
      this.activateVehicleDialog();
      // this.$axios.post("/vehicles", {
      //   make: "Ford",
      //   model: "F150",
      //   color: "Red",
      //   vehicle_type_id: 2,
      //   capacity: 4,
      //   mpg: 30,
      //   license_state: "WA",
      //   license_number: "10"
      // })
      // .then(result => {
      //     if (result.status === 200) {
      //       if (result.data.ok) {
      //         this.showSnackbar("Success");
      //       } else {
      //         this.showSnackbar(result.data.msge);
      //       }
      //     }
      //   })
      //   .catch(err => this.showSnackbar(err));
    },
    
    cancelVehicle() {
      this.vehicleDialog.show = false;
    }
    
    // saveVehicle(vehicle) {
    //   if (vehicle instanceof Error) {
    // 
    //   }
    // }
  }
};
</script>