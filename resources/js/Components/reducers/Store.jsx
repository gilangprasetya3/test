const Store = (state = {students:[],teachers:[],subjects:[],marks:[]}, action) => {
    switch(action.type){
        case "updatedStudents":
            return {
                ...state,
                students: action.payload,
            };
            case "updatedTeachers":
                
                return {
                    ...state,
                    teachers: action.payload,
                };
                case "updatedSubjects":
                return {
                    ...state,
                    subjects: action.payload,
                };
                  case "updatedMarks":
                return {
                    ...state,
                    marks: action.payload,
                };
                
        default:
            return state
    }
  }
  
  export default Store;