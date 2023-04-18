import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../css/Homepage.scss";
import { Form, Button, Spinner, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

const Homepage = () => {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchBreeds = async () => {
      const response = await axios.get("https://api.thecatapi.com/v1/breeds");
      // Keep only the breeds with unique IDs
      const uniqueBreeds = response.data.filter(
        (breed, index, self) =>
          index === self.findIndex((b) => b.id === breed.id)
      );
      setBreeds(uniqueBreeds);
    };
    fetchBreeds();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.thecatapi.com/v1/images/search?page=${currentPage}&limit=10&breed_id=${selectedBreed}`
      );
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        const newImages = response.data.filter(
          (image, index, self) =>
            index === self.findIndex((i) => i.id === image.id)
        );
        setImages([...images, ...newImages]);
      }
      setIsLoading(false);
    };
    if (selectedBreed !== "") {
      fetchImages();
    }
  }, [selectedBreed, currentPage]);

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleBreedChange = (event) => {
    console.log(event.target.value);
    if (event.target.value === "Select Breed") {
      setHasMore(false);
      setSelectedBreed(event.target.value);
      setImages([]);
    } else {
      setSelectedBreed(event.target.value);
      setImages([]);
      setCurrentPage(1);
      setHasMore(true);
    }
  };

  return (
    <div className="homepage">
      <Form.Group>
        <b>
          <Form.Label className="catBrowserLabel">Cat Browser</Form.Label>
        </b>
        <br />
        <h6>Breed</h6>
        <Form.Select as="select" onChange={handleBreedChange}>
          <option value="Select Breed">Select Breed</option>
          {breeds.map((breed) => (
            <option value={breed.id} key={breed.id}>
              {breed.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <div className="grid-container">
        {images.map((image) => (
          <Card key={image.id} className="cat-card">
            <Card.Img
              variant="top"
              src={image.url}
              alt="cat"
              className="cat-image"
            />
            <Card.Body>
              {image.id !== "" && (
                <Link to={`/${image.id}`}>
                  <Button variant="primary">View details</Button>
                </Link>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
      <br />
      {isLoading && (
        <div className="loading-spinner">
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only"></span>
          </Spinner>
        </div>
      )}

      {hasMore && (
        <div className="load-more-button">
          <Button
            className="btn btn-success"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            Load more
          </Button>
        </div>
      )}
      <br />

      {!hasMore && <div>No more cats to load</div>}
    </div>
  );
};

export default Homepage;
