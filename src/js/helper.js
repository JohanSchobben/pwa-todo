function getParentViaSelector(element, selector){
  if(!element){
    return undefined;
  }
  else if(element.matches(selector)){
    return element;
  }
  return getParentViaSelector(element.parentElement, selector);
}