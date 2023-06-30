import PropTypes from "prop-types";

export default function DemoOne(props) {
  const { title, x } = props;

  return (
    <div className="demo-box" style={props.style}>
      <div className="title">{title}</div>
      <span>{x}</span>
    </div>
  );
}
/* 通过把函数当做对象，设置静态的私有属性方法，来给其设置属性的校验规则 */
DemoOne.defaultProps = {
  x: 0,
};
DemoOne.propTypes = {
  title: PropTypes.string.isRequired,
  x: PropTypes.number,
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};
