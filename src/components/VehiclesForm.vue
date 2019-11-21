<template>
  <v-card>
    <v-card-title>
      <span class="headline">Add Vehicle</span>
    </v-card-title>
    <v-card-text>
      <form>
        
      </form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="secondary" flat :disabled="saving" v-on:click="cancel">Cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" flat :disabled="saving" v-on:click="clear">Clear</v-btn>
      <v-btn
        color="primary"
        raised
        :disabled="saving"
        :loading="saving"
        v-on:click="save"
        >Save</v-btn
      >
    </v-card-actions>
  </v-card>
</template>