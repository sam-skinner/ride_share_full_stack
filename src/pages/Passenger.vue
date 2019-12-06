<template>
  <v-container>
    <div>      
      <!-- Header -->
      <v-toolbar>
        <v-layout justify-space-between>
          <v-flex shrink align-self-center>
            <v-toolbar-title>Passenger</v-toolbar-title>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink justify-self-center>
            <v-combobox
              label="Select Passenger" 
              v-model="passenger"
              :items="passengers"
              item-text="passenger"
              item-value="id"
              hide-selected
              :search-input.sync="search"
            >
              <template slot='item' slot-scope='{ item }'>
                {{ item.first_name }} {{ item.last_name }}
              </template>
              <template v-slot:no-data>
                <v-list-item @click="addNewPassenger(search)">
                  <v-list-item-content>
                    <v-list-item-title>
                      Create "<strong>{{ search }}</strong>"?
                    </v-list-item-title>
                  </v-list-item-content>            
                </v-list-item>
              </template>
              <template v-slot:selection="{ attrs, item, parent, selected }">
                <span 
                  v-bind="attrs"
                  :input-value="selected">
                  {{ item.first_name }} {{ item.last_name }}
                </span>
              </template>
            </v-combobox>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink justify-self-center>
            <v-btn color="primary" raised v-on:click.stop="">Sign Up For a Ride</v-btn>
          </v-flex>
        </v-layout>
      </v-toolbar>

      <!-- Create Passenger dialog -->
      <v-dialog
        persistent
        scrollable
        v-model="passengerDialog.show"
        max-width="500px"
      >
        <PassengerForm
          v-bind:initialData="passengerDialog.passenger"
          v-on:cancel="cancelCreate"
          v-on:save="savePassenger"
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
import PassengerForm from "../components/PassengerForm";

export default {
  name: "Passenger",
  
  components: {
    PassengerForm
  },
  
  data: function() {
    return {
      snackbar:{
        show: false,
        text: ""
      },
      
      passenger: {},
      passengers: [],
      search: null,
      
      passengerDialog: {
        show: false,
        passenger: {}
      }
    }
  },
  
  mounted: function() {
    this.$axios.get("/passengers").then(response => {
      response.data.map(t => this.passengers.push(t));
    });
  },
  
  methods: {
    // Display a snackbar message.
    showSnackbar(text) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },
    
    addNewPassenger(newPassenger) {
      this.activatePassengerDialog({ ...newPassenger });
    },
    
    activatePassengerDialog(passenger = {}) {
      this.passengerDialog.passenger = passenger;
      this.passengerDialog.show = true;
    },
    
    cancelCreate() {
      this.passengerDialog.show = false;
    },
    
    savePassenger(passenger) {
      this.$axios.get("/passengers").then(response => {
        response.data.map(t => this.passengers.push(t));
      });
      this.passengerDialog.show = false;
    }
  }
};
</script>