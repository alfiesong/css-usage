document.addEventListener("wheel", wheelFunction, support ? { passive: true } : false );
 document.addEventListener("wheel", wheelFunction, { passive: isPassive, capture: true });

