import { useRouter } from 'next/router'
import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload';

const Home = () => {

  const router = useRouter()
  const [userInfo, setuserInfo] = useState({
    _id: '',
    name: '',
    email: '',
    image: '',
    password: '',
    emailVerified: false,
    phone: '',
    role: 'user',
  });
  const fileInput = useRef<HTMLInputElement>(null);

  const getUserInfo = async () => { // initialize page(get user info)
    const res = await fetch(`/api/admin/users/${router.query['id'] ? router.query['id'] : 'me'}`, {
      method: "GET",
    });

    const response = await res.json();
    if (response.data)
      setuserInfo(response.data);
  };

  useEffect(() => {
    getUserInfo();
  }, [userInfo._id])

  return (
    <div className="home min-h-screen text-black flex items-center flex-col">
      <section className="w-full">
        <div className="p-0">
          <h1 className="h3 mb-3">Settings</h1>
          <Tab.Container id="left-tabs-example" defaultActiveKey="account">
            <Row>
              <Col md={5} xl={4}>
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Profile Settings</h5>
                  </div>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="account">Account</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="password">Password</Nav.Link>
                    </Nav.Item>
                    {/* <Nav.Item>
                      <Nav.Link eventKey="privacy">Privacy and safety</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="email_notify">Email notifications</Nav.Link>
                    </Nav.Item> */}
                  </Nav>
                  </div>
              </Col>
              <Col md={7} xl={8}>
                <Tab.Content>
                  <Tab.Pane eventKey="account">
                    <div className="tab-pane" id="account" role="tabpanel">
                      <div className="card">
                        <div className="card-header">
                          <div className="card-actions float-right">
                            <div className="dropdown show">
                              <a href="#/" data-toggle="dropdown" data-display="static">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal align-middle">
                                  <circle cx="12" cy="12" r="1"></circle>
                                  <circle cx="19" cy="12" r="1"></circle>
                                  <circle cx="5" cy="12" r="1"></circle>
                                </svg>
                              </a>

                              <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#/">Action</a>
                                <a className="dropdown-item" href="#/">Another action</a>
                                <a className="dropdown-item" href="#/">Something else here</a>
                              </div>
                            </div>
                          </div>
                          <h5 className="card-title mb-0">Public info</h5>
                        </div>
                        <div className="card-body">
                          <form>
                            <div className="row">
                              <div className="col-md-8">
                                <div className="form-group">
                                  <label className="m-2" htmlFor="inputUsername">Username</label>
                                  <input type="text" className="form-control" id="inputUsername" placeholder="Username" defaultValue={userInfo.name}/>
                                </div>
                                <div className="form-group">
                                  <label className="m-2" htmlFor="inputEmail4">Email</label>
                                  <input type="email" className="form-control" id="inputEmail4" placeholder="Email" defaultValue={userInfo.email}/>
                                </div>
                                <div className="form-group col-md-4">
                                  <label className="m-2" htmlFor="inputState">Role</label>
                                  <select id="inputState" className="form-control" defaultValue={userInfo.role}>
                                    <option value="assistant">Assistant</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                </div>
                                {/* <div className="form-group">
                                  <label className="m-2" htmlFor="inputBio">Biography</label>
                                  <textarea rows={2} className="form-control" id="inputBio" placeholder="Tell something about yourself"></textarea>
                                </div> */}
                              </div>
                              <div className="col-md-4">
                                <div className="text-center">
                                  <img alt="Andrew Jones" src="https://bootdey.com/img/Content/avatar/avatar1.png" className="rounded-circle img-responsive mt-2" width="128" height="128" />
                                  <div className="mt-2">
                                    <span className="btn btn-primary">
                                      <FontAwesomeIcon
                                        icon={faUpload}
                                        onClick={()=>{}}
                                      ></FontAwesomeIcon>
                                    </span>
                                  </div>
                                  <small>htmlFor best results, use an image at least 128px by 128px in .jpg format</small>
                                </div>
                              </div>
                            </div>

                            <button type="submit" className="btn btn-primary mt-4">Save changes</button>
                          </form>

                        </div>
                      </div>

                      <div className="card">
                        <div className="card-header">
                          <div className="card-actions float-right">
                            <div className="dropdown show">
                              <a href="#/" data-toggle="dropdown" data-display="static">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal align-middle">
                                  <circle cx="12" cy="12" r="1"></circle>
                                  <circle cx="19" cy="12" r="1"></circle>
                                  <circle cx="5" cy="12" r="1"></circle>
                                </svg>
                              </a>

                              <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#/">Action</a>
                                <a className="dropdown-item" href="#/">Another action</a>
                                <a className="dropdown-item" href="#/">Something else here</a>
                              </div>
                            </div>
                          </div>
                          <h5 className="card-title mb-0">Private info</h5>
                        </div>
                        <div className="card-body">
                          <form>
                            <div className="form-row">
                              <div className="form-group col-md-6">
                                <label className="m-2" htmlFor="inputFirstName">First name</label>
                                <input type="text" className="form-control" id="inputFirstName" placeholder="First name" />
                              </div>
                              <div className="form-group col-md-6">
                                <label className="m-2" htmlFor="inputLastName">Last name</label>
                                <input type="text" className="form-control" id="inputLastName" placeholder="Last name" />
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="m-2" htmlFor="inputAddress">Address</label>
                              <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" />
                            </div>
                            <div className="form-group">
                              <label className="m-2" htmlFor="inputAddress2">Address 2</label>
                              <input type="text" className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                            </div>
                            <div className="form-row">
                              <div className="form-group col-md-6">
                                <label className="m-2" htmlFor="inputCity">City</label>
                                <input type="text" className="form-control" id="inputCity" />
                              </div>
                              <div className="form-group col-md-4">
                                <label className="m-2" htmlFor="inputState">State</label>
                                <select id="inputState" className="form-control">
                                  <option defaultValue={""}>Choose...</option>
                                  <option>...</option>
                                </select>
                              </div>
                              <div className="form-group col-md-2">
                                <label className="m-2" htmlFor="inputZip">Zip</label>
                                <input type="text" className="form-control" id="inputZip" />
                              </div>
                            </div>
                            <button type="submit" className="btn btn-primary mt-4" disabled>Save changes</button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="password">
                    <div className="tab-pane" id="password" role="tabpanel">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Password</h5>

                          <form>
                            <div className="form-group">
                              <label className="m-2" htmlFor="inputPasswordCurrent">Current password</label>
                              <input type="password" className="form-control" id="inputPasswordCurrent" />
                              <small><a href="#/">Forgot your password?</a></small>
                            </div>
                            <div className="form-group">
                              <label className="m-2" htmlFor="inputPasswordNew">New password</label>
                              <input type="password" className="form-control" id="inputPasswordNew" />
                            </div>
                            <div className="form-group">
                              <label className="m-2" htmlFor="inputPasswordNew2">Verify password</label>
                              <input type="password" className="form-control" id="inputPasswordNew2" />
                            </div>
                            <button type="submit" className="btn btn-primary mt-4">Save changes</button>
                          </form>

                        </div>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </section>
    </div>
  );
}

export default React.memo(Home)

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
}
