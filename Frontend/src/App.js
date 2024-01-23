// Import necessary libraries
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as d3 from "d3";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import UserForm from "./Components/UserForm";

const SunburstChart = ({ data, width, height }) => {
  useEffect(() => {
    try {
      if (data) {
        drawSunburstChart(data, width, height);
      }
    } catch (error) {
      console.error("Error drawing Sunburst chart:", error.message);
    }
  }, [data, width, height]);

  const drawSunburstChart = (data, width, height) => {
    // Clear existing chart
    d3.select("#sunburst-chart").selectAll("*").remove();

    if (!data) {
      console.error("Error drawing Sunburst chart: Data is null");
      return;
    }

    const radius = Math.min(width, height) / 2;
    
    const color = d3.scaleOrdinal(d3.schemeCategory10);


  const partition = d3.partition().size([2 * Math.PI, radius]);

  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle(0.01)
    .padRadius(radius / 2)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1 - 1);

  const root = d3.hierarchy(data).sum((d) => d.size || 1); // Ensure 'size' property exists

  const svg = d3
    .select("#sunburst-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

    svg
    .selectAll("path")
    .data(partition(root).descendants())
    .enter()
    .append("path")
    .attr("d", arc)
    .style("fill", (d) => color((d.children ? d : d.parent).data.name))
    .on("click", (event, d) => {
      svg.transition().duration(750).tween("scale", () => {
        const xd = d3.interpolate(0, width / 2);
        const yd = d3.interpolate(0, height / 2);
        const yr = d3.interpolate(0, radius);
        return (t) => {
          svg.attr("transform", `translate(${xd(t)},${yd(t)})`);
          svg.attr("r", yr(t));
        };
      });
    });

  svg.append("text").attr("text-anchor", "middle").attr("font-size", 18).text("Sunburst Chart");
};

  return <div id="sunburst-chart"></div>;
};

const App = () => {
  
  // State to hold the user data
  const [userData, setUserData] = useState([]);


  // Fetch data from the API on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://zrava-interview-api.onrender.com/"
      );
      setUserData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to handle user deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://zrava-interview-api.onrender.com/delete/${id}`
      );
      fetchData(); // Fetch updated data after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };


  // Transform data for Sunbrust Chart
  const sunburstData = {
    name: "root",
    children: userData.map((user) => ({
      name: user.userName,
      children: [
        { name: `District: ${user.district}` , size: 1},
        { name: `State: ${user.state}`, size: 1},
        { name: `Country: ${user.country}`, size: 1},
      ],
    })),
  };


  return (
    <div className="app">
      <Container>
        <header>
          <h1 className="d-flex justify-content-center text-danger">
            Welcome To Sanjhey Hariram SA Zrava Creative Concept Task
          </h1>
        </header>
        <main>
          <section className="sunburst-chart mt-3">
            <h1 className="text-success">Sunburst Chart</h1>
            <div className="d-flex justify-content-center mt-3">
              <SunburstChart data={sunburstData} width={400} height={400} />
            </div>
          </section>
          <section className="form  mt-3">
            <UserForm/>
          </section>
          <section className="userdataTable  mt-3">
          <h1 className="text-success">User Data</h1>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>District</th>
                <th>State</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {userData[0] ? (
                userData.map((user) => {
                  return (
                    <>
                      <tr key={user._id}>
                        <td>{user.userName}</td>
                        <td>{user.district}</td>
                        <td>{user.state}</td>
                        <td>{user.country}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    </>
                  );
                })
              ) : (
                <h1>No Data</h1>
              )}
            </tbody>
          </Table>
          </section>
        </main>
      </Container>
    </div>
  );
};

export default App;
