<template>
  <b-container fluid>
    <b-row>
      <b-col sm="3">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Main</h4>
          </template>
          <template v-slot:body>
            <div class="iq-sidebar-menu">
              <ul class="iq-menu">
                <li :class="section=='main'?'active':''" @click="setSection('main')">
                  <a href="javascript:void(0)">Main</a>
                </li>
                <li :class="section=='subCategory'?'active':''" @click="setSection('subCategory')">
                  <a href="javascript:void(0)">Sub-Category</a>
                </li>
                <li @click="setSection('specifications')">
                  <a href="javascript:void(0)" v-b-toggle.specifications>Specification</a>
                  <ul class="iq-submenu">
                    <b-collapse tag="ul" id="specifications" accordion="categorySidebar" :visible ="section=='specifications'">
                      <li
                        v-for="(item,index) in categoryData.specifications"
                        :key="index"
                      >
                        <a href="javascript:void(0)" :class="`iq-waves-effect`">
                          <span>{{ item.label }}</span>
                        </a>
                      </li>
                    </b-collapse>
                  </ul>
                </li>
              </ul>
            </div>
          </template>
        </iq-card>
        {{$route.params.id}}
        {{$route.params.name}}
      </b-col>
      <b-col sm="6">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Main</h4>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col>
                <b-form-input type="text" placeholder="Name"></b-form-input>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { core } from '../../config/pluginInit'
export default {
  name: 'CategoryMain',
  data () {
    return {
      section: 'main',
      categoryData: {
        specifications: [
          {
            label: 'test1',
            description: '',
            inputType: '',
            options: []
          },
          {
            label: 'test2',
            description: '',
            inputType: '',
            options: []
          },
          {
            label: 'test3',
            description: '',
            inputType: '',
            options: []
          }
        ]
      }
    }
  },
  methods: {
    setSection (str) {
      this.section = str
    }
  },
  mounted () {
    core.index()
  }
}
</script>
