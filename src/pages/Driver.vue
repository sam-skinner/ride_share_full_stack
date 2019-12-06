<template>
  <v-container>
    <div>      
      <!-- Header -->
      <v-toolbar>
        <v-layout justify-space-between>
          <v-flex shrink align-self-center>
            <v-toolbar-title>Driver</v-toolbar-title>
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
  name: "Driver",
  
  data: function() {
    return {
      snackbar:{
        show: false,
        text: ""
      }
    }
  },
  
  mounted: function() {
    
  },
  
  methods: {
    // Display a snackbar message.
    showSnackbar(text) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    }
  }
};
</script>