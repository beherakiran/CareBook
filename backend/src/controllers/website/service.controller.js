import ServiceModel from "../../models/service.model.js";

export const view = (request, response) => {
  ServiceModel.find({
    status: true,
    deleted_at: null,
  })
    .select("service_name description price duration")
    .sort({
      service_name: "asc",
      _id: "desc",
    })
    .then((result) => {
      if (result.length !== 0) {
        const data = {
          _status: true,
          _message: "record found",
          _data: result,
        };

        return response.status(200).send(data);
      } else {
        const data = {
          _status: false,
          _message: "No record found",
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
};


export const details = async (request, response) => {
  try {
    const result = await ServiceModel.findOne({
      _id: request.params.id,
      status: true,
      deleted_at: null,
    }).select("service_name description price duration");

    if (result) {
      const data = {
        _status: true,
        _message: "Record Found.",
        _data: result,
      };

      return response.send(data);
    } else {
      const data = {
        _status: false,
        _message: "No Record Found.",
        _data: null,
      };

      return response.send(data);
    }
  } catch (error) {
    console.log(error);

    const data = {
      _status: false,
      _message: "Something went wrong.",
      _data: null,
    };

    return response.send(data);
  }
};