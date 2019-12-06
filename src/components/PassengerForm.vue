<template>
  <v-card>
    <v-card-title>
      <span class="headline">Create New Account</span>
    </v-card-title>
    <v-card-text>
      <form>
        <v-row align="center">
          <v-col col="12" sm="6">
            <v-text-field
              v-model="newPassenger.first_name"
              v-bind:rules="rules.required"
              label="First Name"
            ></v-text-field>
          </v-col>
          <v-col col="12" sm="v6">
            <v-text-field
              v-model="newPassenger.last_name"
              v-bind:rules="rules.required"
              label="Last Name"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col col="12" sm="6">
            <v-text-field
              v-model="newPassenger.phone"
              v-bind:rules="rules.required"
              label="Phone Number"
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
  name: "PassengerCreation",
  data: function() {
    return {
      valid: false,
      
      newPassenger: {
        first_name: "",
        last_name: "",
        phone: ""
      },

      passengerCreated: false,

      dialogHeader: "<no dialogHeader>",
      dialogText: "<no dialogText>",
      dialogVisible: false,

      rules: {
        required: [val => val.length >= 0 || "Required"]
      }
    };
  },
  
  watch: {
    initialData(passengerProp) {
      var first = true;
      for (var i = 0; i < Object.keys(passengerProp).length; i++) {
        if (passengerProp[i] == " ") {
          first = false;
          continue;
        } else if (first) {
          this.newPassenger.first_name += passengerProp[i]; 
        } else if (!first) {
          this.newPassenger.last_name += passengerProp[i]; 
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

  mounted: function() {
    this.loadData();
  },
  
  methods: {
    loadData() {
      var first = true;
      for (var i = 0; i < Object.keys(this.initialData).length; i++) {
        if (this.initialData[i] == " ") {
          first = false;
          continue;
        } else if (first) {
          this.newPassenger.first_name += this.initialData[i]; 
        } else if (!first) {
          this.newPassenger.last_name += this.initialData[i]; 
        }
      }
    },
    
    handleClear: function() {
      this.newPassenger.first_name = "";
      this.newPassenger.last_name = "";
      this.newPassenger.phone = "";
    },
    
    handleSave: function() {
      this.passengerCreated = false;
      this.$axios
        .post("/passengers", {
          first_name: this.newPassenger.first_name,
          last_name: this.newPassenger.last_name,
          phone: this.newPassenger.phone
        })
        .then(result => {
          if (result.status == 200) {
            if (result.data.ok) {
              this.$emit("save");
              this.passengerCreated = true;
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
      if (this.passengerCreated) {
        this.$router.push({ name: "passenger" });
      }
    }
  }
};
</script>
