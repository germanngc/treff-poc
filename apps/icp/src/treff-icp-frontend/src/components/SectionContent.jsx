const SectionContent = (props) => {
  const combinedClassName = `pt-4 pl-2 pb-3 ${props.className} hero-body`;
  return (
    <section className={"hero is-" + props.type || "white"} style={props.style}> 
      <div className={combinedClassName}>
        <div className="columns">
          <div className="column is-12 has-text-left">{props.children}</div>
        </div>
      </div>
    </section>
  );
};

export default SectionContent;
