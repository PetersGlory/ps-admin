<template>
  <b-container fluid>
    <b-row>
      <b-col sm="3" v-for="item in categories" :key="item.id">
       <iq-card>
          <template v-slot:headerTitle>
            <router-link :to="{ name : 'dashboard.category.edit' , params:{ id : item.id }}">
              <h4 class="card-title">{{item.category_name}}</h4>
            </router-link>
          </template>
          <template v-slot:headerAction>
            <router-link :to="{ name : 'dashboard.category.edit' , params:{ id : item.id }}" title="Edit">
              <i class="las la-pen"></i>
            </router-link>
          </template>
          <template v-slot:body>
            <div>
              Sub Category : <strong>{{item.sub_category.length}}</strong>
            </div>
            <div class="d-flex align-item-center">
              <span>Status : </span> <b-form-checkbox class="ml-2" v-model="item.status" :disabled="true" name="check-button" switch inline :key="item.id+'cod'"></b-form-checkbox>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    {{paginationInfo}}
     <b-pagination value="1"
              :total-rows="pagination.total"
              @change="onPageChange"
    ></b-pagination>
 </b-container>
</template>
<script>
import API from '@/api'
import { core } from '../../config/pluginInit'
export default {
  name: 'CategoryMain',
  data () {
    return {
      categories: [],
      queryParams: {},
      pagination: {
        pageSize: 10,
        offset: 1,
        total: 0
      }
    }
  },
  components: {
  },
  computed: {
    paginationInfo () {
      let str = ''
      const entry = this.pagination.total === 1 ? ' entry' : ' entries'
      if (this.pagination.total <= this.pagination.pageSize) {
        str =
          `Showing ${this.pagination.total} of ${this.pagination.total}` +
          entry
      } else {
        str =
          `Showing ${this.pagination.offset} to ${this.pagination.pageSize} of ${this.pagination.total}` +
          entry
      }
      return str
    }
  },
  mounted () {
    core.index()
  },
  methods: {
    onPageChange (offset) {
      this.pagination.offset = offset
      this.init()
    },
    init () {
      this.queryParams.offset = this.pagination.offset
      this.queryParams.limit = this.pagination.pageSize
      API.getCategories({
        ...this.queryParams
      }).then(response => {
        this.categories = response.results
        this.pagination = {
          pageSize: 10,
          offset: response.offset,
          total: response.count
        }
      }).catch(e => {
      })
    }
  },
  created () {
    this.init()
  }
}
</script>
