<template>
  <v-card>
    <v-card-title>
      <span class="headline">Create New Driver Account</span>
    </v-card-title>
    <v-card-text>
      <form>
        <v-row align="center">
          <v-col col="12" sm="6">
            <v-select 
              label="Drivers" 
              v-model="newAuthorization.driver_id"
              :items="drivers"
              item-text="first_name"
              item-value="id"
            >
             <template slot='selection' slot-scope='{ item }'>
               {{ item.first_name }} {{ item.last_name }}
             </template>
             <template slot='item' slot-scope='{ item }'>
               {{ item.first_name }} {{ item.last_name }}
             </template>
            </v-select>
          </v-col>
          <v-col col="12" sm="v6">
            <v-select 
              label="Vehicles" 
              v-model="newAuthorization.vehicle_id"
              :items="vehicles"
              item-text="make"
              item-value="id"
            >
             <template slot='selection' slot-scope='{ item }'>
               {{ item.make }} {{ item.model }}
             </template>
             <template slot='item' slot-scope='{ item }'>
               {{ item.make }} {{ item.model }}
             </template>
            </v-select>
          </v-col>
        </v-row>
      </form>
    </v-card-text>

    <v-card-actions>
      <v-btn 
        color="secondary" 
        v-on:click="cancel"
      >Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn 
        color="primary" 
        v-on:click="handleClear"
      >Clear</v-btn>
      <v-btn
        color="primary"
        raised
        v-on:click="handleSave"
      >Create Account</v-btn>
    </v-card-actions>

    <div class="text-xs-center">
      <v-dialog v-model="dialogVisible" width="500">
        <v-card>
          <v-card-title primary-title>
            {{ dialogHeader }}
          </v-card-title>

          <v-card-text>
            {{ dialogText }}
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text v-on:click="hideDialog">Okay</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "AuthorizationCreation",
  data: function() {
    return {
      valid: false,
      
      newAuthorization: {
        vehicle_id: "",
        driver_id: ""
      },

      drivers: [],
      vehicles: [],
      
      authorizationCreated: false,

      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,
    };
  },
  
  mounted: function() {
    this.$axios.get("/drivers").then(response => {
     response.data.map(l => this.drivers.push(l));
    });
     
    this.$axios.get("/vehicles").then(response => {
      response.data.map(l => this.vehicles.push(l));
    });
  },
   
  methods: {
    
    
    handleClear: function() {
      this.newAuthorization.vehicle_id = "";
      this.newAuthorization.driver_id = "";
    },
    
    handleSave: function() {
      this.authorizationCreated = false;
      this.$axios
        .post("/drivers-vehicles", {
          vehicle_id: this.newAuthorization.vehicle_id.toString(),
          driver_id: this.newAuthorization.driver_id.toString()
        })
        .then(result => {
          if (result.status == 200) {
            if (result.data.ok) {
              this.$emit("save");
              this.authorizationCreated = true;
            } else {
              this.showDialog("Failed", result.data.msge);
            }
          }
        })
        .catch(err => this.showDialog("Failed", err));
    },
    cancel: function() {
      this.handleClear();
      this.$emit("cancel");
    },
    showDialog: function(header, text) {
      this.dialogHeader = header;
      this.dialogText = text;
      this.dialogVisible = true;
    },
    hideDialog: function() {
      this.dialogVisible = false;
      if (this.driverCreated) {
        this.$router.push({ name: "driver" });
      }
    }
  }
};
</script>
