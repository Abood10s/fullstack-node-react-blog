import { request } from "../../utils/API";
import { categoryActions } from "../Slices/categorySlice";
import { toast } from "react-toastify";

// Get All Categories
export const fetchCategories = () => {
  return async (dispatch) => {
    try {
      const { data } = await request.get("/api/categories");
      dispatch(categoryActions.setCategories(data));
    } catch (error) {
      //   toast.error(error.response.data.message);
      console.log(error);
    }
  };
};

// Create Category
export const createCategory = (newCategory) => {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.post("/api/categories", newCategory, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
        },
      });
      dispatch(categoryActions.addCategory(data));
      toast.success("Category Created Successfully");
    } catch (error) {
      //toast.error(error.response.data.message);
      console.log(error);
    }
  };
};

// Delete Category
export const deleteCategory = (categoryId) => {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.delete(`/api/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
        },
      });
      dispatch(categoryActions.deleteCategory(data.categoryId));
      toast.success(data?.message);
    } catch (error) {
      //toast.error(error.response.data.message);
      console.log(error);
    }
  };
};
