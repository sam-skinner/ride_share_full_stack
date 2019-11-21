<template>
  <v-container>
    <div>
      <h4 class="display-1">Vehicles</h4>
      
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
export default {
  name: "Vehicles",
  
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
    updateVehicle(item) {
      console.log("UPDATE", JSON.stringify(item, null, 2));
      this.showSnackbar("Sorry, update is not yet implemented.");
    },
    
    // Add a vehicle
    addVehicle(item) {
      console.log("ADD", JSON.stringify(item, null, 2));
      this.showSnackbar("Sorry, add is not yet implemented.");
    }
  }
};
</script>