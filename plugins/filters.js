import Vue from "vue"
import _ from "lodash"

Vue.filter("errorMessage", error => {
  let message = ""

  error = error.response

  if (error.data && error.data.response) {
    const { response } = error.data

    if (response.errors) {
      const first_error = _.values(response.errors)[0]
      const required = _.findWhere(first_error, {
        rule: "required"
      })

      if (required) message = required.message
      else message = first_error[0].message
    }
    if (!message && response.message) message = response.message
    if (!message) message = "Unknown error occured"
  } else if (error.data && error.data.message) {
    message = error.data.message
  } else {
    if (_.isString(error)) message = error
    else
      message =
        error.statusText ||
        "Request timed out or not able to connect to server, please try again."
  }

  return message
})
