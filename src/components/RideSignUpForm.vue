<template>
  <v-card>
    <v-card-title>
      <span class="headline">Choose a Ride</span>
    </v-card-title>
    <v-card-text>
      <form>
        <v-row align="center">
         <v-select 
           label="Available Rides" 
           v-model="ride_id"
           :items="rides"
           item-text="to_location_name"
           item-value="id"
         >
          <template slot='selection' slot-scope='{ item }'>
            {{ item.time }} {{ item.from_location_name }} to {{ item.to_location_name }}
          </template>
          <template slot='item' slot-scope='{ item }'>
            {{ item.time }} {{ item.from_location_name }} to {{ item.to_location_name }}
          </template>
         </v-select>
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
        raised
        v-on:click="handleSave"
      >Sign Up For Ride</v-btn>
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
  name: "RideSignUp",
  data: function() {
    return {
      valid: false,
      
      passenger: {},
      ride_id: "",
      
      rides: [],
      locationList: [],
      
      newPassengerRideCreated: false,

      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,
    };
  },
  
  watch: {
    initialData(passengerProp) {
      this.passenger = passengerProp;
    }
  },
  
  props: {
    initialData: {
      type: Object,
      required: true
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
                  date: ride.date,
                  time: ride.time.substring(0, 5),
                  distance: ride.distance,
                  fuel_price: ride.fuel_price,
                  fee: ride.fee,
                  vehicle_id: ride.vehicle_id,
                  from_location_id: ride.from_location_id,
                  to_location_id: ride.to_location_id,
                  to_location_name: this.findLocationById(ride.to_location_id, this.locationList).name,
                  from_location_name: this.findLocationById(ride.from_location_id, this.locationList).name,
                }));
              });
            });
          });
        });
      });
    });
  },
  
  methods: {
    
    handleSave: function() {
      this.passengerCreated = false;
      if (this.passenger.license_number != null) {
        this.$axios
          .post("/drivers-rides", {
            driver_id: this.passenger.id,
            ride_id: this.ride_id
          })
          .then(result => {
            if (result.status == 200) {
              if (result.data.ok) {
                console.log("SAVED");
                this.$emit("save");
                this.ride_id = "";
                this.newPassengerRideCreated = true;
              } else {
                this.showDialog("Failed", result.data.msge);
              }
            }
          })
          .catch(err => this.showDialog("Failed", err));
      } else {
        this.$axios
          .post("/passengers-rides", {
            passenger_id: this.passenger.id,
            ride_id: this.ride_id
          })
          .then(result => {
            if (result.status == 200) {
              if (result.data.ok) {
                this.$emit("save");
                this.ride_id = "";
                this.newPassengerRideCreated = true;
              } else {
                this.showDialog("Failed", result.data.msge);
              }
            }
          })
          .catch(err => this.showDialog("Failed", err));
      }
    },
    cancel: function() {
      this.ride_id = "";
      this.$emit("cancel");
    },
    
    findLocationById(id, myArray){
     for (var i=0; i < myArray.length; i++) {
         if (myArray[i].id === id) {
             return myArray[i];
         }
     }
    },
    
    showDialog: function(header, text) {
      this.dialogHeader = header;
      this.dialogText = text;
      this.dialogVisible = true;
    },
    hideDialog: function() {
      this.dialogVisible = false;
      if (this.newPassengerRideCreated) {
        this.$router.push({ name: "passenger" });
      }
    }
  }
};
</script>
