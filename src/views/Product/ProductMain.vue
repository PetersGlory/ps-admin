<template>
  <b-container fluid>
    <b-row>
      <b-col sm="3" v-for="item in products" :key="item.id">
       <iq-card>
          <template v-slot:headerTitle>
            <router-link :to="{ name : 'dashboard.category.edit' , params:{ id : item.id }}">
              <h4 class="card-title"> <strong>{{item.product_name}}</strong></h4>
              <p class="mb-1">SKU Code : <strong>{{item.product_code}}</strong></p>
            </router-link>
          </template>
          <template v-slot:body>
            <p class="mb-1">Category : <strong>{{item.category_name}}</strong></p>
            <p class="mb-1">Sub Category : <strong>{{item.sub_category_name}}</strong></p>
            <p class="mb-1 text-center"><img class="img-bound" :src="'https://pujasahitya.s3.ap-south-1.amazonaws.com/'+item.default_img" :alt="item.product_name"></p>
            <p class="mb-1"> Price : <strong><span v-html="$config.CURRENCY_ICON"></span> {{item.price}}</strong></p>
            <p class="mb-1">Minimum Stock : <strong>{{item.minimum_stock}}</strong></p>
            <p class="mb-1">
              <b-form-checkbox v-model="item.is_cod" :disabled="true" name="check-button" switch inline :key="item.id+'cod'">
                COD
              </b-form-checkbox>
            </p>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    {{paginationInfo}}
     <b-pagination value="1"
        :perPage="10"
        :total-rows="pagination.total"
        @change="onPageChange"
    ></b-pagination>
 </b-container>
</template>
<style lang="css">
  .img-bound{
    max-height: 200px;
    width: auto;
    max-width: 100%;
  }
</style>
<script>
import API from '@/api'
import { core } from '../../config/pluginInit'
export default {
  name: 'ProductMain',
  data () {
    return {
      products: [],
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
      API.getProducts({
        ...this.queryParams
      }).then(response => {
        this.products = response.results
        this.pagination = {
          pageSize: 10,
          offset: response.offset || 1,
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
