import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slice/profileSlice"
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  // GET_INSTRUCTOR_DATA_API,
  GET_INSTRUCTOR_STATS_API
} = profileEndpoints

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
      dispatch(setUser({ ...response.data.data, image: userImage }))
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR............", error)
      toast.error("Could Not Get User Details")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorisation: `Bearer ${token}`,
      }
    )
    console.log(
      "GET_USER_ENROLLED_COURSES_API API RESPONSE............",
      response
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
  }
  toast.dismiss(toastId)
  return result
}

// export async function getInstructorData(token) {
//   const toastId = toast.loading("Loading...")
//   let result = []
//   try {
//     const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
//       Authorization: `Bearer ${token}`,
//     })
//     console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
//     result = response?.data?.courses
//   } catch (error) {
//     console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
//     toast.error("Could Not Get Instructor Data")
//   }
//   toast.dismiss(toastId)
//   return result
// }

export async function getInstructorStats(token) {
  const toastId = toast.loading("Loading...");
  let result = [];

  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_STATS_API, null, {
      Authorisation: `Bearer ${token}`
    });

    if(!response.data.success){
      throw new Error(response.data.message);
    }

    if(response.data.success){
      toast.success(response.data.message);
    }

    console.log("GET_INSTRUCTOR_STATS_API API..........", response);
    result = response.data.data;
  }
  catch (error) {
    console.log("Get Instructor Stats Data API ERROR............", error);
    toast.error("Could Not Get Instructor Stats Data");
  }

  toast.dismiss(toastId);
  return result;
}