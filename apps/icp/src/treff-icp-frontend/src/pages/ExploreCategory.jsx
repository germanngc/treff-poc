import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import React, { useEffect, useState } from "react";
import CategoryApi from "../api/CategoryApi";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { getURLImage } from "../utils/images";
import CustomSection from "../components/CustomSection";
import SectionContent from "../components/SectionContent";

const ExploreCategory = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({});
  const [allCategories, setAllCategories] = useState([]);
  useEffect(() => {
    const getCategories = async () => {
      const cat = await CategoryApi.getCategories();
      setCategories(cat);
      setAllCategories(cat);
    };
    getCategories();
  }, []);
  const navigate = useNavigate();

  const seeSubCategories = (category) => {
    if (category.subCategories && category.subCategories.length > 0) {
      var dataBreadcrumbs = [...breadcrumb];
      dataBreadcrumbs.push(
        <li>
          <Link onClick={(e) => seeSubCategories(category)}>
            {category.name}
          </Link>
        </li>
      );

      setBreadcrumb(dataBreadcrumbs);
      setCategory(category);
      setCategories(category.subCategories);
    } else {
      navigate(routes.EXPLORE + category.id);
    }
  };

  const setDefaultCategories = (category) => {
    setCategory({});
    setCategories(allCategories);
    setBreadcrumb(breadcrumbs);
  };

  let breadcrumbs = [
    <li>
      <Link onClick={setDefaultCategories}>Todas las categorías</Link>
    </li>,
  ];

  const [breadcrumb, setBreadcrumb] = useState(breadcrumbs);

  const getCategoriesCards = (categories) => {
    return categories.map((s, index) => (
      <div
        onClick={(e) => seeSubCategories(s)}
        key={index}
        className="column is-4-desktop is-6-tablet is-3-widescreen is-12-mobile has-text-left"
      >
        <div
          className="has-text-centered"
          style={{
            width: "auto",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            cursor: "pointer",
            padding: "10px 0px 0px 0px",
          }}
        >
          <div>
            <img src={getURLImage(s.image)} alt="servicio" />
          </div>
          <p className="p-blue">
            <b>{s.name}</b>
          </p>
        </div>
      </div>
    ));
  };

  return (
    <>
      <CustomSection type="white">
        <section
          className="hero is-primary img-header"
          style={{
            backgroundImage: category.coverImage
              ? "url('" + getURLImage(category.coverImage) + "')"
              : "url('" +
                "/images/pexels-mateusz-dach-409480 1.png')",
          }}
        >
          <div className="hero-body">
            <div className="columns is-multiline">
              <div className="column is-7-desktop has-text-left has-text-left-mobile  has-text-left-tablet is-12-tablet">
                <h1
                  className="has-text-white title ml-4 size-20"
                  style={{ fontWeight: 800 }}
                >
                  Explora a nuestros servicios
                </h1>
                <div>
                  <img
                    className="pt-0 img-logo-287"
                    src={
                      "/images/Logo Treff blanco  2 (2).png"
                    }
                    alt="treff"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </CustomSection>

      <CustomSection type="white" className="mb-6">
        <SectionContent type="light" className="pt-6 pl-2 pb-6">
          <p className="subtitle-dark mb-1">Categorías</p>
          <nav className="breadcrumb mt-3" aria-label="breadcrumbs">
            <ul>{breadcrumb.map((b) => b)}</ul>
          </nav>
          {category.name ? (
            <p
              onClick={(e) => setDefaultCategories()}
              className="p-blue mb-2 has-text-right mr-5"
              style={{ cursor: "pointer" }}
            >
              <b>Ver categorías </b>
            </p>
          ) : null}
          {categories.length > 0 ? (
            <div className="columns is-multiline pl-6 pr-6 has-text-center">
              {getCategoriesCards(categories)}
            </div>
          ) : null}
        </SectionContent>
      </CustomSection>
      
    </>
  );
};

export default ExploreCategory;
