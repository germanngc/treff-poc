actor {
  stable var greeting : Text = "Hello";

  public query func greet(name : Text) : async Text {
    return greeting # ", " # name # "!";
  };
};
