const CustomSection = (props) => {
  const combinedClassName = `hero-body pb-0 pt-0 ${props.className}`;
  return (
    <section className={"hero is-" + props.type || "white"}>
      <div className={combinedClassName}>
        <div className="columns">
          <div className="column is-10 is-offset-1 has-text-left pl-0 pr-0 pt-5">
            {props.children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomSection;
