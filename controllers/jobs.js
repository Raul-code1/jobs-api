const { StatusCodes } = require("http-status-codes");

const Job = require("../models/Job");
const { NotFoundError, BadRequestError } = require("../errors");


const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};




const getJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findOne({ _id: id, createdBy: req.user.userId });

  if (!job) {
    throw new NotFoundError(`Not job with id ${id}`);
  }

  res.status(StatusCodes.OK).json({ job });
};




const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};





const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or position must be specified");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`Not job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({job});
};





const deleteJob = async (req, res) => {
    const { params:{id:jobId},user:{userId} }=req

    const job= await Job.findByIdAndRemove({
        _id: jobId,
        createdBy: userId,
    })

    if (!job) {
        throw new NotFoundError(`Not job with id ${jobId}`);
    }

  res.status(StatusCodes.OK).json({msg:'Delete job'});
};








module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
