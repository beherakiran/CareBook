import ServiceModel from "../../models/service.model.js";

export const create = async (request, response) => {
  ServiceModel.findOne({
    service_name: request.body.service_name,
    deleted_at: null,
  }).then((existingService) => {
    if (existingService) {
      const data = {
        _status: false,
        _message: "Service already exists",
        _data: "",
      };
      return response.status(409).send(data);
    }

    ServiceModel(request.body)
      .save()
      .then((result) => {
        const data = {
          _status: true,
          _message: "record created",
          _data: result,
        };
        return response.status(201).send(data);
      })
      .catch((err) => {
        var errorMessage = {};
        for (var key in err.errors) {
          errorMessage[key] = err.errors[key].message;
        }
        const data = {
          _status: false,
          _message: "Something went wrong",
          _error: errorMessage,
          _data: "",
        };
        return response.status(400).send(data);
      });
  });
};

export const view = async (request, response) => {
  var page = 1;
  var limit = 15;

  if (request.body) {
    if (request.body.limit) {
      limit = Number(request.body.limit);
    }

    if (request.body.page) {
      page = Number(request.body.page);
    }
  }

  var skip = (page - 1) * limit;

  var condition = {
    deleted_at: null,
  };

  if (request.body && request.body.service_name) {
    condition.service_name = request.body.service_name;
  }

  var totalRecords = await ServiceModel.countDocuments(condition);

  ServiceModel.find(condition)
    .select("service_name description price duration status")
    .sort({
      service_name: "asc",
      _id: "desc",
    })
    .limit(limit)
    .skip(skip)
    .then((result) => {
      if (result.length != 0) {
        const data = {
          _status: true,
          _message: "record found",
          _paginate: {
            current_page: page,
            limit: limit,
            total_pages: Math.ceil(totalRecords / limit),
            total_records: totalRecords,
          },
          _data: result,
        };
        return response.status(200).send(data);
      } else {
        const data = {
          _status: false,
          _message: "No record found",
          _paginate: {
            current_page: page,
            limit: limit,
            total_pages: Math.ceil(totalRecords / limit),
            total_records: totalRecords,
          },
          _data: [],
        };
        return response.status(404).send(data);
      }
    })
    .catch(() => {
      const data = {
        _status: false,
        _message: "Something went wrong",
        _data: [],
      };
      return response.status(500).send(data);
    });
}

export const details = (request, response) => {
  ServiceModel.findOne({
    _id: request.params.id,
    deleted_at: null,
  })
    .then((result) => {
      if (result) {
        const data = {
          _status: true,
          _message: "record found",
          _data: result,
        };
        return response.send(data);
      } else {
        const data = {
          _status: false,
          _message: "No record found",
          _data: null,
        };
        return response.send(data);
      }
    })
    .catch(() => {
      const data = {
        _status: false,
        _message: "Something went wrong",
        _data: [],
      };
      return response.send(data);
    });
};

export const update = (request, response) => {
  var dateUpdate = {
    ...request.body,
    updated_at: Date.now(),
  };

  ServiceModel.updateOne(
    {
      _id: request.params.id,
      deleted_at: null,
    },
    dateUpdate,
    { runValidators: true }
  )
    .then((result) => {
      if (result.matchedCount === 0) {
        return response.send({
          _status: false,
          _message: "Service not found",
          _data: "",
        });
      }

      const data = {
        _status: true,
        _message: "record updated",
        _data: result,
      };
      return response.send(data);
    })
    .catch((err) => {
      var errorMessage = {};

      if (err.errors) {
        for (var key in err.errors) {
          errorMessage[key] = err.errors[key].message;
        }
      }

      const data = {
        _status: false,
        _message: "Something went wrong",
        _error: errorMessage,
        _data: "",
      };
      return response.send(data);
    });
};


export const deleteService = (request, response) => {
  ServiceModel.updateOne(
    {
      _id: request.params.id,
      deleted_at: null,
    },
    {
      deleted_at: Date.now(),
    }
  )
    .then((result) => {
      if (result.matchedCount === 0) {
        return response.send({
          _status: false,
          _message: "Service not found",
          _data: "",
        });
      }

      return response.send({
        _status: true,
        _message: "record Deleted",
        _data: result,
      });
    })
    .catch(() => {
      return response.send({
        _status: false,
        _message: "Something went wrong",
        _data: "",
      });
    });
};

export const changeStatus = async (request, response) => {
  const service = await ServiceModel.findOne({
    _id: request.params.id,
    deleted_at: null,
  });

  if (service) {
    const dateUpdate = {
      status: !service.status,
      updated_at: Date.now(),
    };

    ServiceModel.updateOne(
      { _id: request.params.id },
      dateUpdate
    )
      .then((result) => {
        return response.status(200).send({
          _status: true,
          _message: "Status changed successfully",
          _data: result,
        });
      })
      .catch((error) => {
        return response.status(500).send({
          _status: false,
          _message: "Something went wrong",
          _data: "",
        });
      });
  } else {
    return response.status(404).send({
      _status: false,
      _message: "Service not found",
      _data: "",
    });
  }
};
