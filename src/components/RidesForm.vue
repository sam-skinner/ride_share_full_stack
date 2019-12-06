<template>
  <v-card>
    <v-card-title>
      <span class="headline">Add Ride</span>
    </v-card-title>
    <v-card-text>
      <form>
        <v-row align="center">
          <v-col col="12" sm="6">
            <v-date-picker
              v-model="newRide.date"
              v-bind:rules="rules.required"
              width="200"
            ></v-date-picker>
          </v-col>
          <v-col col="12" sm="6">
            <v-time-picker
              v-model="newRide.time"
              v-bind:rules="rules.required"
              width="200"
            ></v-time-picker>
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col col="12" sm="6">
            <v-select 
              label="From Location" 
              v-model="newRide.from_location_id"
              v-bind:rules="rules.required"
              :items="locationList"
              item-text="name"
              item-value="id"
            ></v-select>
          </v-col>
          <v-col col="12" sm="6">
            <v-select 
              label="To Location" 
              v-model="newRide.to_location_id"
              v-bind:rules="rules.required"
              :items="locationList"
              item-text="name"
              item-value="id"
            ></v-select>
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col col="12" sm="12">
            <v-select 
              label="Vehicle" 
              v-model="newRide.vehicle_id"
              :items="vehicleList"
              item-text="license_number"
              item-value="id"
            ></v-select>
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
      >Save</v-btn>
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
  name: "RideCreation",
  data: function() {
    return {
      valid: false,
      
      newRide: {
        date: "",
        time: "",
        vehicle_id: "",
        from_location_id: "",
        to_location_id: ""
      },
      locationList: [],
      vehicleList: [],
      
      rideCreated: false,

      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,

      rules: {
        required: [val => val.length >= 0 || "Required"]
      }
    };
  },
  watch: {
    initialData(rideProp) {
      this.newRide = rideProp;
      this.newRide.date = this.getDateFromTimestamp(rideProp.date);
      this.newRide.time = this.getTimeFromTimestamp(rideProp.time);
    }
  },
  props: {
    editMode: {
      type: Boolean,
      required: true
    },
    initialData: {
      type: Object,
      required: true
    }
  },
  beforeMount: function() {
    this.$axios.get("/locations").then(response => {
      response.data.map(l => this.locationList.push(l));
    });
    this.$axios.get("/vehicles").then(response => {
      response.data.map(v => this.vehicleList.push(v));
    });
  },
  mounted: function() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.newRide = this.initialData;
      this.newRide.date = this.getDateFromTimestamp(this.initialData.date);
      this.newRide.time = this.getTimeFromTimestamp(this.initialData.time);
    },
    handleClear: function() {
      this.newRide.date = "";
      this.newRide.time = "";
      this.newRide.from_location_id = "";
      this.newRide.to_location_id = "";
      this.newRide.vehicle_id = "";
    },
    handleSave: function() {
      if (this.editMode) {
        this.rideCreated = false;
        const rideId = this.newRide.id;
        delete this.newRide.id;

        this.$axios
          .put(`/rides/${rideId}`,{
            date: this.newRide.date,
            time: this.newRide.time,
            from_location_id: this.newRide.from_location_id,
            to_location_id: this.newRide.to_location_id,
            vehicle_id: this.newRide.vehicle_id
          })
          .then(result => {
            if (result.status == 200) {
              if (result.data.ok) {
                this.$emit("save");
                this.rideCreated = true;
              } else {
                this.showDialog("Failed", result.data.msge);
              }
            }
          })
          .catch(err => this.showDialog("Failed", err));
      } else {
        this.rideCreated = false;
        this.$axios
          .post("/rides", {
            date: this.newRide.date,
            time: this.newRide.time,
            from_location_id: this.newRide.from_location_id,
            to_location_id: this.newRide.to_location_id,
            vehicle_id: this.newRide.vehicle_id
          })
          .then(result => {
            if (result.status == 200) {
              if (result.data.ok) {
                this.$emit("save");
                this.rideCreated = true;
              } else {
                this.showDialog("Failed", result.data.msge);
              }
            }
          })
          .catch(err => this.showDialog("Failed", err));
      }
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
      if (this.rideCreated) {
        this.$router.push({ name: "rides" });
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
      return `${yr}-${mo}-${da}`;
    },

    getTimeFromTimestamp(ts) {
      return String(ts.substring(0, 5));
    }
  }
};
</script>
