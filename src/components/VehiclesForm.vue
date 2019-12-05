<template>
  <v-card>
    <v-card-title>
      <span class="headline">Add Vehicle</span>
    </v-card-title>
    <v-card-text>
      <form></form>
    </v-card-text>

    <v-row align="center">
      <v-col col="12" sm="6">
        <v-text-field
          v-model="newVehicle.make"
          v-bind:rules="rules.required"
          label="Make"
        ></v-text-field>
      </v-col>
      <v-col col="12" sm="6">
        <v-text-field
          v-model="newVehicle.model"
          v-bind:rules="rules.required"
          label="Model"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col col="12" sm="6">
        <v-text-field
          v-model="newVehicle.color"
          v-bind:rules="rules.required"
          label="Color"
        ></v-text-field>
      </v-col>
      <v-col col="12" sm="6">
        <v-select 
          label="Vehicle Type" 
          v-model="newVehicle.vehicle_type_id"
          v-bind:rules="rules.required"
          :items="typesList"
          item-text="type"
          item-value="id"
        ></v-select>
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col col="12" sm="6">
        <v-text-field
          v-model="newVehicle.capacity"
          v-bind:rules="rules.required"
          label="Capacity"
        ></v-text-field>
      </v-col>
      <v-col col="12" sm="6">
        <v-text-field
          v-model="newVehicle.mpg"
          v-bind:rules="rules.required"
          label="MPG"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row align="center">
      <v-col col="12" sm="6">
        <v-select 
          label="License State" 
          v-model="newVehicle.license_state"
          v-bind:rules="rules.required"
          :items="statesList"
          item-text="name"
        ></v-select>
      </v-col>
      <v-col col="12" sm="6">
        <v-text-field
          v-model="newVehicle.license_number"
          v-bind:rules="rules.required"
          label="License Number"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-card-actions>
      <v-btn 
        color="secondary" 
        :disabled="saving" 
        v-on:click="cancel"
      >Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn 
        color="primary" 
        :disabled="saving" 
        v-on:click="handleClear"
      >Clear</v-btn>
      <v-btn
        color="primary"
        raised
        :disabled="saving"
        :loading="saving"
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
  name: "VehicleCreation",
  data: function() {
    return {
      valid: false,

      newVehicle: {
        make: "",
        model: "",
        color: "",
        vehicle_type_id: "",
        capacity: "",
        mpg: "",
        license_state: "",
        license_number: ""
      },
      typesList: [],
      statesList: [],

      vehicleCreated: false,

      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,

      rules: {
        required: [val => val.length > 0 || "Required"]
      }
    };
  },
  beforeMount: function() {
    console.log("hi");
    this.$axios.get("/vehicle-types").then(response => {
      response.data.map(t => this.typesList.push(t));
    });
    console.log(this.typesList);
    this.$axios.get("/states").then(response => {
      response.data.map(s => this.statesList.push(s));
    });
    console.log(this.statesList);
  },
  methods: {
    handleClear: function() {
      this.newVehicle.make = "";
      this.newVehicle.model = "";
      this.newVehicle.color = "";
      this.newVehicle.capacity = "";
      this.newVehicle.mpg = "";
      this.newVehicle.license_number = "";
      this.newVehicle.vehicle_type_id = "";
      this.newVehicle.license_state = "";
    },
    handleSave: function() {
      this.vehicleCreated = false;
      this.$axios
        .post("/vehicles", {
          make: this.newVehicle.make,
          model: this.newVehicle.model,
          color: this.newVehicle.color,
          vehicle_type_id: this.newVehicle.vehicle_type_id,
          capacity: this.newVehicle.capacity,
          mpg: this.newVehicle.mpg,
          license_state: this.newVehicle.license_state,
          license_number: this.newVehicle.license_number
        })
        .then(result => {
          if (result.status == 200) {
            if (result.data.ok) {
              this.$emit("save");
              // this.showDialog("Success", result.data.msge);
              this.vehicleCreated = true;
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
      if (this.vehicleCreated) {
        this.$router.push({ name: "vehicles" });
      }
    }
  }
};
</script>
