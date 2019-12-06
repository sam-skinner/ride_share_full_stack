<template>
  <v-container>
    <div>      
      <!-- Header -->
      <v-toolbar>
        <v-layout justify-space-between>
          <v-flex shrink align-self-center>
            <v-toolbar-title>Passenger</v-toolbar-title>
          </v-flex>
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
        </v-layout>
      </v-toolbar>

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
  name: "Passenger",
  
  data: function() {
    return {
      snackbar:{
        show: false,
        text: ""
      },
      
      passenger: {},
      passengers: [],
      search: null
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
      console.log(newPassenger);
      // TODO: Sign up dialog
      // this.$axios
      //   .post("/passengers", {
      //      type: item
      //   })
      //   .then(result => {
      //     if (result.status == 200) {
      //       if (result.data.ok) {
      //         this.$axios.get("/vehicle-types").then(response => {
      //           response.data.map(t => this.typesList.push(t));
      //         });              
      //         this.newVehicle.vehicle_type_id = { id: result.data.id, type: item };
      //       } else {
      //         this.showDialog("Failed", result.data.msge);
      //       }
      //     }
      //   })
      //   .catch(err => this.showDialog("Failed", err));
    }
  }
};
</script>