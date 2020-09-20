<template>
  <b-container fluid>
    <b-row>
      <b-col sm="3">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Sidebar</h4>
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
                  <a href="javascript:void(0)" v-b-toggle.specifications>Specification <i class="ri-arrow-right-s-line iq-arrow-right"></i></a>
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
      </b-col>
      <b-col sm="6">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Main</h4>
          </template>
          <template v-slot:headerAction>
            <b-button variant="outline-danger"  size="sm" class="mr-2" @click="deleteCategory()">
              <i aria-hidden="true" class="m-0 fa fa-trash"></i>
            </b-button>
            <b-button variant="outline-info" v-if="mainReadOnly" size="sm" class="mr-2" @click="editCategory()">
              <i aria-hidden="true" class="m-0 fa fa-pencil-alt"></i>
            </b-button>
            <b-button variant="outline-success" v-if="!mainReadOnly" size="sm" class="mr-2" @click="saveCategory()">
              <i aria-hidden="true" class="m-0 fa fa-save"></i>
            </b-button>
            <b-button variant="outline-dark" v-if="!mainReadOnly" size="sm" @click="cancelCategory()">
              <i aria-hidden="true" class="m-0 fa fa-times"></i>
            </b-button>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col>
               <p v-if="mainReadOnly">{{categoryData.category_name}}</p>
                <b-form-input v-else class="mb-2" type="text" placeholder="Name" v-model="categoryData.category_name"></b-form-input>
              </b-col>
            </b-row>
          </template>
        </iq-card>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Sub Category</h4>
          </template>
          <template v-slot:body>
            <iq-card class="border">
              <template v-slot:headerTitle>
                <h4 class="card-title">Add Sub Category</h4>
              </template>
              <template v-slot:headerAction>
                 <b-button variant="outline-danger"  size="sm" class="mr-2" @click="deleteSubCategory(addSubCategoryInitData)">
                   <i aria-hidden="true" class="m-0 fa fa-trash"></i>
                  </b-button>
                  <b-button variant="outline-success" v-if="!addSubCategoryInitData.readOnly" size="sm" class="mr-2" @click="addSubCategory(addSubCategoryInitData)">
                    <i aria-hidden="true" class="m-0 fa fa-save"></i>
                  </b-button>
              </template>
              <template v-slot:body>
                <b-row>
                  <b-col>
                    <div class="d-flex align-item-center justify-content-between mb-2">
                      <strong>Name : </strong>
                      <div>

                      </div>
                    </div>
                    <p v-if="addSubCategoryInitData.readOnly">{{addSubCategoryInitData.sub_category_name}}</p>
                    <b-form-input v-else class="mb-2" type="text" placeholder="Name" v-model="addSubCategoryInitData.sub_category_name"></b-form-input>
                    <div class="d-flex align-item-center">
                      <span>Status : </span> <b-form-checkbox class="ml-2" v-model="addSubCategoryInitData.status" :disabled="addSubCategoryInitData.readOnly" name="check-button" switch inline :key="'add-cod'"></b-form-checkbox>
                    </div>
                  </b-col>
                </b-row>
              </template>
            </iq-card>
            <iq-card v-for="(subCategory, subCategoryIndex) in categoryData.sub_category" :key="subCategory.id" class="border">
                <template v-slot:headerTitle>
                <h4 class="card-title">Sub Category {{subCategoryIndex + 1}}</h4>
              </template>
              <template v-slot:headerAction>
                  <b-button variant="outline-danger"  size="sm" class="mr-2" @click="deleteSubCategory(subCategory)">
                    <i aria-hidden="true" class="m-0 fa fa-trash"></i>
                  </b-button>
                  <b-button variant="outline-info" v-if="subCategory.readOnly" size="sm" class="mr-2" @click="editSubCategory(subCategory)">
                    <i aria-hidden="true" class="m-0 fa fa-pencil-alt"></i>
                  </b-button>
                  <b-button variant="outline-success" v-if="!subCategory.readOnly" size="sm" class="mr-2" @click="saveSubCategory(subCategory)">
                    <i aria-hidden="true" class="m-0 fa fa-save"></i>
                  </b-button>
                  <b-button variant="outline-dark" v-if="!subCategory.readOnly" size="sm" @click="cancelSubCategory(subCategory)">
                    <i aria-hidden="true" class="m-0 fa fa-times"></i>
                  </b-button>
              </template>
              <template v-slot:body>
                <b-row>
                  <b-col>
                    <div class="d-flex align-item-center justify-content-between mb-2">
                      <strong>Name : </strong>
                    </div>
                    <p v-if="subCategory.readOnly">{{subCategory.sub_category_name}}</p>
                    <b-form-input v-else class="mb-2" type="text" placeholder="Name" v-model="subCategory.sub_category_name"></b-form-input>
                    <div class="d-flex align-item-center">
                      <span>Status : </span> <b-form-checkbox class="ml-2" v-model="subCategory.status" :disabled="subCategory.readOnly" name="check-button" switch inline :key="subCategory.id+'cod'"></b-form-checkbox>
                    </div>
                  </b-col>
                </b-row>
              </template>
            </iq-card>
          </template>
        </iq-card>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Specification</h4>
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
import API from '@/api'
import { core } from '../../config/pluginInit'
export default {
  name: 'CategoryMain',
  data () {
    return {
      section: 'main',
      mainReadOnly: true,
      addSubCategoryInitData: {
        status: false,
        readOnly: false
      },
      ogCategoryData: {},
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
    },
    init () {
      this.mainReadOnly = true
      API.getCategoryById({
        id: this.$route.params.id
      }).then(response => {
        this.categoryData = response
        this.ogCategoryData = this.$helper.objectDeepClone(response)
        this.categoryData.specifications = JSON.parse(response.specification)
        if (this.categoryData.sub_category) {
          this.categoryData.sub_category.forEach(element => {
            element.readOnly = true
          })
        }
        this.resetAddSubCategory()
      }).catch(e => {
        this.resetAddSubCategory()
      })
    },
    editSubCategory (subCategory) {
      subCategory.readOnly = false
      this.categoryData = this.$helper.objectDeepClone(this.categoryData)
    },
    cancelSubCategory (subCategory) {
      subCategory.readOnly = true
      var ogSubCategory = this.$helper.objectDeepClone(this.ogCategoryData.sub_category.find(item => item.id === subCategory.id))
      subCategory.status = ogSubCategory.status
      subCategory.sub_category_name = ogSubCategory.sub_category_name
      this.categoryData = this.$helper.objectDeepClone(this.categoryData)
    },
    saveSubCategory (subCategory) {
      subCategory.category_id = this.ogCategoryData.id
      API.saveSubCategories(subCategory).then(data => {
        subCategory.readOnly = true
        subCategory.status = data.status
        subCategory.sub_category_name = data.sub_category_name
        this.categoryData = this.$helper.objectDeepClone(this.categoryData)
      }).catch(e => {
        subCategory.readOnly = true
        this.categoryData = this.$helper.objectDeepClone(this.categoryData)
      })
    },
    addSubCategory (subCategory) {
      subCategory.category_id = this.ogCategoryData.id
      API.addSubCategories(subCategory).then(data => {
        this.init()
      }).catch(e => {
        this.init()
      })
    },
    deleteSubCategory (subCategory) {
      API.deleteSubCategories(subCategory).then(data => {
        this.init()
      }).catch(e => {
        this.init()
      })
    },
    resetAddSubCategory () {
      this.addSubCategoryInitData = {
        status: false,
        readOnly: false
      }
    },
    deleteCategory () {
      API.deleteCategory(this.categoryData).then(data => {
        this.$router.push({ name: 'dashboard.category' })
      }).catch(e => {})
    },
    editCategory () {
      this.mainReadOnly = false
    },
    saveCategory () {
      API.saveCategory(this.categoryData).then(data => {
        this.init()
      }).catch(e => {
        this.init()
      })
    },
    cancelCategory () {
      this.mainReadOnly = true
      this.init()
    }
  },
  mounted () {
    core.index()
  },
  created () {
    this.init()
  }
}
</script>
