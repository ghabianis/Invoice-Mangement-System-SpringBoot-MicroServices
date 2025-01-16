package org.ms.clientservice.web;
import org.ms.clientservice.entities.Client;
import org.ms.clientservice.repository.ClientRepository;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
//@RestController
public class ClientRestController{
@Autowired
private ClientRepository clientRepository;
@GetMapping(path="/clients")
public List<Client> list()
{
return clientRepository.findAll();
}
@GetMapping(path="/clients/{id}")
public Client getOne( @PathVariable Long id)
{
return clientRepository.findById( id).get();
}
@PostMapping(path="/clients")
public Client save(@RequestBody Client client)
{
return clientRepository.save(client);
}
@PutMapping (path="/clients/{id}")
public Client update(@PathVariable Long id,@RequestBody Client client)
{
client.setId(id);
return clientRepository.save(client);
}
@DeleteMapping (path="/clients/{id}")
public void delete( @PathVariable Long id)
{
clientRepository.deleteById( id);
}
}