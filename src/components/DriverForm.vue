<template>
  <v-card>
    <v-card-title>
      <span class="headline">Create New Driver Account</span>
    </v-card-title>
    <v-card-text>
      <form>
        <v-row align="center">
          <v-col col="12" sm="6">
            <v-text-field
              v-model="newDriver.first_name"
              v-bind:rules="rules.required"
              label="First Name"
            ></v-text-field>
          </v-col>
          <v-col col="12" sm="v6">
            <v-text-field
              v-model="newDriver.last_name"
              v-bind:rules="rules.required"
              label="Last Name"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col col="12" sm="6">
            <v-text-field
              v-model="newDriver.phone"
              v-bind:rules="rules.required"
              label="Phone Number"
            ></v-text-field>
          </v-col>     
          <v-col col="12" sm="6">
            <v-text-field
              v-model="newDriver.license_number"
              v-bind:rules="rules.required"
              label="License Number"
            ></v-text-field>
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
  name: "DriverCreation",
  data: function() {
    return {
      valid: false,
      
      newDriver: {
        first_name: "",
        last_name: "",
        phone: "",
        license_number: ""
      },

      driverCreated: false,

      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,

      rules: {
        required: [val => val.length >= 0 || "Required"]
      }
    };
  },
  
  watch: {
    initialData(driverProp) {
      var first = true;
      for (var i = 0; i < Object.keys(driverProp).length; i++) {
        if (driverProp[i] == " ") {
          first = false;
          continue;
        } else if (first) {
          this.newDriver.first_name += driverProp[i]; 
        } else if (!first) {
          this.newDriver.last_name += driverProp[i]; 
        }
      }
    }
  },
  
  props: {
    initialData: {
      type: Object,
      required: true
    }
  },

  methods: {
    
    handleClear: function() {
      this.newDriver.first_name = "";
      this.newDriver.last_name = "";
      this.newDriver.phone = "";
      this.newDriver.license_number = "";
    },
    
    handleSave: function() {
      this.driverCreated = false;
      this.$axios
        .post("/drivers", {
          first_name: this.newDriver.first_name,
          last_name: this.newDriver.last_name,
          phone: this.newDriver.phone,
          license_number: this.newDriver.license_number
        })
        .then(result => {
          if (result.status == 200) {
            if (result.data.ok) {
              this.$emit("save");
              this.driverCreated = true;
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
