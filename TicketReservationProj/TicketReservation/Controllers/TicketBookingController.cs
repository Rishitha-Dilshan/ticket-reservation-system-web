﻿using Microsoft.AspNetCore.Mvc;
using ticketreservation.Models; // Make sure to import your model namespace
using ticketreservation.Services;
using TicketReservation.Services;

namespace ticketreservation.Controllers
{
    [Route("api/ticket")]
    [ApiController]
    public class TicketBookingController : ControllerBase
    {
        private readonly TicketBookingServices _ticketServices;

        public TicketBookingController(TicketBookingServices ticketServices)
        {
            _ticketServices = ticketServices;
        }

        // GET: api/train
        [HttpGet]
        public async Task<ActionResult<List<TicketBooking>>> Get()
        {
            var tickets = await _ticketServices.GetAsync();
            return Ok(tickets);
        }

        // GET: api/train/{id}
        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<TicketBooking>> GetById(string id)
        {
            var ticket = await _ticketServices.GetAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }
            return Ok(ticket);
        }

        // POST: api/train
        [HttpPost]
        public async Task<IActionResult> Create(TicketBooking ticket)
        {
            // Check if there are already 4 reservations for the given ReferenceId
            int existingReservationsCount = await _ticketServices.GetReservationCountByReferenceIdAsync(ticket.ReferenceId);

            if (existingReservationsCount >= 4)
            {
                var customResponse = new
                {
                    Message = "Maximum 4 reservations per reference ID are allowed.",
                    Status = "Error" // You can include additional status information if needed
                };

                return StatusCode(StatusCodes.Status200OK, customResponse);
            }
            else {
                await _ticketServices.createAsync(ticket);
                return CreatedAtAction(nameof(Get), new { id = ticket.Id }, ticket);
            }
         

        }

        // PUT: api/train/{id}
        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, TicketBooking updatedTicket)
        {
            var existingTicket = await _ticketServices.GetAsync(id);
            if (existingTicket == null)
            {
                return NotFound();
            }
            updatedTicket.Id = existingTicket.Id;
            await _ticketServices.updateAsync(id, updatedTicket);
            return Ok("Updated Succesfully");
        }

        // DELETE: api/train/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existingTicket = await _ticketServices.GetAsync(id);
            if (existingTicket == null)
            {
                return NotFound();
            }
            await _ticketServices.deleteAsync(id);
            return Ok("Deleted Succesfully");
        }
    }
}