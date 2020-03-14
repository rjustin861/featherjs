const { fastJoin } = require("feathers-hooks-common");

// const fastResolvers = {
//   joins: {
//     employees: $select => async (employees, context) =>
//       (employees.department = (
//         await context.app.service("department").find({
//           query: { _id: employees.department, $select: $select },
//           paginate: false
//         })
//       )[0])
//   }
// };

// const query = {
//   employees: [["_id", "name"]]
// };

const dependentResolver = {
  joins: {
    department: $select => async (dependent, context) => {
      console.log("+++++++++++++++++");
      console.log(dependent);
      dependent.department = (
        await context.app.service("department").find({
          query: { _id: dependent.department, $select: $select },
          paginate: false
        })
      )[0];
    }
  }
};

const fastResolvers = {
  joins: {
    employees: {
      resolver: $select => async (employees, context) => {
        console.log(employees);
        employees.department = (
          await context.app.service("department").find({
            query: { _id: employees.department, $select: $select },
            paginate: false
          })
        )[0];
        return employees.dependent;
      },
      joins: dependentResolver
    }
  }
};

const query = {
  employees: {
    args: [["_id", "name"]],
    department: [["_id", "name"]]
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [fastJoin(fastResolvers, query)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
