const BASE_URL = process.env.REACT_APP_BASE_URL;


export const DELETE_TASKS_OF_INTERN = BASE_URL+"/tasks/delete/intern/";
export const GET_TASKS_PERCENTAGE = BASE_URL+"/tasks/count/get/percentage";
export const GET_TOTAL_TASKS = BASE_URL+"/tasks/count/all/";
export const NUMBER_OF_TASKS_BY_ID = BASE_URL+"/tasks/count/";
export const FETCH_TASKS = BASE_URL+"/tasks/";
export const DELETE_TASK_BY_ID = BASE_URL+"/tasks/delete/";
export const UPDATE_TASK_BY_ID = BASE_URL+"/tasks/update/";
export const CREATE_TASK = BASE_URL+"/tasks/add";
export const TASK_COMPLETION_PERCENTAGE = BASE_URL+"/tasks/count/get/percentage/";
export const TASK_STATUS_PERCENTAGE = BASE_URL+"/tasks/count/status/percentage/";
export const UPDATE_TASK_STATUS = BASE_URL+"/tasks/update/statut/";
export const UPDATE_TASK_PERCENTAGE = BASE_URL+"/tasks/update/percentage/";