import {createSlice} from "@reduxjs/toolkit"
import { TenantSidebar } from "./SidebarConstant"


export const sidebarSlice = createSlice({
    name: "sidebar",
    initialState:TenantSidebar,
    reducers: {
      toggleFunc: (state, action) => {
        const item = state.find(content => content.id === action.payload);
        if (item) {
          item.toggle = !item.toggle;
        }
      },
    },
  });

export const {toggleFunc} = sidebarSlice.actions
export default sidebarSlice.reducer