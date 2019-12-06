<template>
  <v-container>
    <div>      
      <!-- Header -->
      <v-toolbar>
        <v-layout justify-space-between>
          <v-flex shrink align-self-center>
            <v-toolbar-title>Authorizations</v-toolbar-title>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink justify-self-end>
            <v-btn color="primary" raised v-on:click.stop="authorizeDriver">Authorize Driver</v-btn>
          </v-flex>
        </v-layout>
      </v-toolbar>
      
      <v-data-table
        class="elevation-1"
        v-bind:headers="headers"
        v-bind:items="authorizations"
      >
      </v-data-table>
      
      <!-- New/Edit dialog -->
      <v-dialog
        persistent
        scrollable
        v-model="authorizeDialog.show"
        max-width="500px"
      >
        <AuthorizeForm
          v-on:cancel="cancelAuthorization"
          v-on:save="saveAuthorization"
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
import AuthorizeForm from "../components/AuthorizeForm";

export default {
  name: "Authorizations",
  
  components: {
    AuthorizeForm
  },
  
  data: function() {
    return {
      headers: [
        { text: "Driver", value: "driver" },
        { text: "Vehicle", value: "vehicle" }
      ],
      authorizations: [],
      
      authorizeDialog: {
        show: false
      },
      
      snackbar:{
        show: false,
        text: ""
      }
    }
  },
  
  mounted: function() {
    this.$axios.get("/vehicles").then(response => {
      let allVehicles = response.data;
      this.$axios.get("/drivers").then(response => {
        let allDrivers = response.data;
        this.$axios.get("/drivers-vehicles").then(response => {
          this.authorizations = response.data.map(authorize => ({
            driver_id: authorize.driver_id,
            vehicle_id: authorize.vehicle_id,
            driver: this.findDriverInDrivers(authorize.driver_id, allDrivers),
            vehicle: this.findVehicle(authorize.vehicle_id, allVehicles)
          }));
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
    
    findDriverInDrivers(id, myArray) {
       for (var i=0; i < myArray.length; i++) {
           if (myArray[i].id === id) {
               return myArray[i].first_name + " " + myArray[i].last_name;
           }
       }
    },
    
    findVehicle(id, myArray) {
       for (var i=0; i < myArray.length; i++) {
           if (myArray[i].id === id) {
               return myArray[i].make + " " + myArray[i].model;
           }
       }
    },
        
    activateAuthorizeDialog() {
      this.authorizeDialog.show = true;
    },
    
    // Authorize a driver
    authorizeDriver() {
      this.activateAuthorizeDialog();
    },
    
    cancelAuthorization() {
      this.authorizeDialog.show = false;
    },
    
    saveAuthorization(authorization) {
      this.$axios.get("/vehicles").then(response => {
        let allVehicles = response.data;
        this.$axios.get("/drivers").then(response => {
          let allDrivers = response.data;
          this.$axios.get("/drivers-vehicles").then(response => {
            this.authorizations = response.data.map(authorize => ({
              driver_id: authorize.driver_id,
              vehicle_id: authorize.vehicle_id,
              driver: this.findDriverInDrivers(authorize.driver_id, allDrivers),
              vehicle: this.findVehicle(authorize.vehicle_id, allVehicles)
            }));
          });
        });
      });  
      this.authorizeDialog.show = false;
    }
  }
};
</script>