package org.ms.produitservice.web;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Hashtable;
import java.util.Map;
@RestController
public class ProduitRestController
{
@GetMapping("/config")
public Map<String,Object> config () {
Map<String,Object> params = new Hashtable<>();
params.put("threadName", Thread.currentThread().toString());
return params;
}
}