import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import Dropzone from "react-dropzone";
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row, UncontrolledTooltip } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "@/Components/Common/Breadcrumb";

//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

import moment from "moment";
import SimpleBar from "simplebar-react";

const Create = ({ errors = {} }) => {
  document.title = "Create New Project | Skote - Vite React Admin & Dashboard Template";

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgStore, setImgStore] = useState([]);
  const [dropList, setDropList] = useState(false);
  const [active, setActive] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectdesc: '',
    assignedto: [],
    projectImage: '',
    img: '',
    startdate: '',
    status: 'Inprogress',
    visibility: 'Private'
  });

  const handleAcceptedFiles = (files) => {
    const newImages = files?.map((file) => {
      return Object.assign(file, {
        priview: URL.createObjectURL(file),
      })
    })
    setSelectedFiles([...selectedFiles, ...newImages]);
    setFormData(prev => ({ ...prev, img: files[0] }));
  };

  const handleImageChange = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setFormData(prev => ({ ...prev, projectImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleClick = (item) => {
    const isItemInImgStore = imgStore.some((imgItem) => imgItem.id === item.id);
    setActive(item.id)
    if (!isItemInImgStore) {
      const newData = [...imgStore, item];
      setImgStore(newData);
      setFormData(prev => ({ ...prev, assignedto: newData }));
    } else {
      const newData = imgStore.filter((imgItem) => imgItem.id !== item.id)
      setImgStore(newData);
      setFormData(prev => ({ ...prev, assignedto: newData }));
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use Inertia's form helper to submit the data
    // This would typically be handled by Inertia's useForm hook in a real implementation
    console.log('Form submitted:', formData);
    // In a real app, you would do something like:
    // Inertia.post('/projects', formData);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Projects" breadcrumbItem="Create New" />

          <Form id="createproject-form" onSubmit={handleSubmit}>
            <Row>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    <input type="hidden" className="form-control" id="formAction" name="formAction" defaultValue="add" />
                    <input type="hidden" className="form-control" id="project-id-input" />
                    <div className="mb-3">
                      <Label htmlFor="name-input">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter Project Name..."
                        onChange={handleChange}
                        value={formData.name}
                        invalid={!!errors.name}
                      />
                      {errors.name && (
                        <FormFeedback type="invalid" className="d-block">{errors.name}</FormFeedback>
                      )}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="useremail-input">Email</Label>
                      <Input
                        id="useremail"
                        name="email"
                        type="email"
                        placeholder="Enter Email..."
                        onChange={handleChange}
                        value={formData.email}
                        invalid={!!errors.email}
                      />
                      {errors.email && (
                        <FormFeedback type="invalid" className="d-block">{errors.email}</FormFeedback>
                      )}
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="userphone-input">Phone</Label>
                      <Input
                        id="userphone"
                        name="phone"
                        type="text"
                        placeholder="Enter Phone..."
                        onChange={handleChange}
                        value={formData.phone}
                        invalid={!!errors.phone}
                      />
                      {errors.phone && (
                        <FormFeedback type="invalid" className="d-block">{errors.phone}</FormFeedback>
                      )}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Project Image</Label>
                      <div className="text-center">
                        <div className="position-relative d-inline-block">
                          <div className="position-absolute bottom-0 end-0">
                            <Label htmlFor="project-image-input" className="mb-0" id="projectImageInput">
                              <div className="avatar-xs">
                                <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                                  <i className="bx bxs-image-alt"></i>
                                </div>
                              </div>
                            </Label>
                            <UncontrolledTooltip placement="right" target="projectImageInput">
                              Select Image
                            </UncontrolledTooltip>
                            <input className="form-control d-none" id="project-image-input" type="file" accept="image/png, image/gif, image/jpeg" onChange={handleImageChange} />
                          </div>
                          <div className="avatar-lg">
                            <div className="avatar-title bg-light rounded-circle">
                              <img src={selectedImage || ''} id="projectlogo-img" alt="" className="avatar-md h-auto rounded-circle" />
                            </div>
                          </div>
                        </div>
                        {errors.projectImage && (
                          <FormFeedback type="invalid" className="d-block">{errors.projectImage}</FormFeedback>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <Label htmlFor="projectdesc-input">Project Description</Label>
                      <Input as="textarea"
                        id="projectdesc"
                        rows={3}
                        name="projectdesc"
                        placeholder="Enter Project Description..."
                        onChange={handleChange}
                        value={formData.projectdesc}
                        invalid={!!errors.projectdesc}
                      />
                      {errors.projectdesc && (
                        <FormFeedback type="invalid" className="d-block">{errors.projectdesc}</FormFeedback>
                      )}
                    </div>
                    <div className="mb-3 position-relative">
                      <Label htmlFor="task-assign-input">Assigned To</Label>
                      <div className="avatar-group justify-content-center" id="assignee-member">
                        {(imgStore || [])?.map((item, idx) => (
                          <React.Fragment key={idx}>
                            <Link to="#" className="avatar-group-item mb-2" id={`assignee-member${idx}`}>
                              <img src={item.imageSrc} alt="" className="rounded-circle avatar-xs" />
                            </Link>
                            <UncontrolledTooltip placement="top" target={`assignee-member${idx}`}>
                              {item.name}
                            </UncontrolledTooltip>
                          </React.Fragment>
                        ))}
                      </div>
                      {errors.assignedto && (
                        <FormFeedback type="invalid" className="d-block">{errors.assignedto}</FormFeedback>
                      )}
                    </div>
                    <div>
                      <Label>Attached Files</Label>
                      <Dropzone
                        onDrop={(acceptedFiles) => {
                          handleAcceptedFiles(acceptedFiles);
                        }}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div className="dropzone">
                            <div
                              className="dz-message needsclick"
                              {...getRootProps()}
                            >
                              <input {...getInputProps()} />
                              <div className="dz-message needsclick">
                                <div className="mb-3">
                                  <i className="display-4 text-muted bx bxs-cloud-upload" />
                                </div>
                                <h4>Drop files here or click to upload.</h4>
                              </div>
                            </div>
                          </div>
                        )}
                      </Dropzone>
                      <div className="dropzone-previews mt-3" id="file-previews">
                        {selectedFiles.map((file, index) => {
                          return (
                            <div className="border rounded" key={index}>
                              <div className="d-flex flex-wrap gap-2 p-2">
                                <div className="flex-shrink-0 me-3">
                                  <div className="avatar-sm bg-light rounded p-2">
                                    <img data-dz-thumbnail="" className="img-fluid rounded d-block" src={file.priview} alt={file.name} />
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="pt-1">
                                    <h5 className="fs-md mb-1" data-dz-name>{file.path}</h5>
                                    <strong className="error text-danger" data-dz-errormessage></strong>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 ms-3">
                                  <Button variant="danger" size="sm" onClick={() => {
                                    const newImages = [...selectedFiles];
                                    newImages.splice(index, 1);
                                    setSelectedFiles(newImages);
                                  }}>Delete</Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {errors.img && (
                        <FormFeedback type="invalid" className="d-block">{errors.img}</FormFeedback>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Publish</h5>
                    <div className="mb-3">
                      <Label htmlFor="project-status-input">Status</Label>
                      <select 
                        className="form-select pageSize" 
                        id="project-status-input"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Inprogress">Inprogress</option>
                        <option value="Delay">Delay</option>
                      </select>
                      {errors.status && (
                        <div className="invalid-feedback d-block">{errors.status}</div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="project-visibility-input">Visibility</Label>
                      <select 
                        className="form-select pageSize" 
                        id="project-visibility-input"
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                      >
                        <option value="Private">Private</option>
                        <option value="Public">Public</option>
                        <option value="Team">Team</option>
                      </select>
                      {errors.visibility && (
                        <div className="invalid-feedback d-block">{errors.visibility}</div>
                      )}
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Due Date</h5>
                    <Flatpickr
                      className="form-control d-block"
                      id="orderdate"
                      name="startdate"
                      placeholder="Select date"
                      options={{
                        mode: "single",
                        dateFormat: 'd M, Y',
                      }}
                      onChange={(customerdate) => {
                        const dateValue = moment(customerdate[0]).format("DD MMMM ,YYYY");
                        setFormData(prev => ({ ...prev, startdate: dateValue }));
                      }}
                      value={formData.startdate || ''}
                    />
                    {errors.startdate && (
                      <FormFeedback type="invalid" className="d-block">{errors.startdate}</FormFeedback>
                    )}
                  </CardBody>
                </Card>
              </Col>
              <Col lg={8}>
                <div className="text-end mb-4">
                  <Button type="submit" color="primary">Create Project</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Create;