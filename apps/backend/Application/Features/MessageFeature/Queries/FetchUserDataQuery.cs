using Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using Application.Interfaces.Repositories;

namespace Application.Features.MessageFeature.Queries
{
    public class FetchUserDataQuery : IRequest<List<Freelancer>>
    {
        public int UserId { get; set; }
        public class FetchUserDataQueryHandler : IRequestHandler<FetchUserDataQuery, List<Freelancer>>
        {
            private readonly IMessageMailRepository _userRepository;

            public FetchUserDataQueryHandler(IMessageMailRepository userRepository)
            {
                _userRepository = userRepository;
            }

            public async Task<List<Freelancer>> Handle(FetchUserDataQuery request, CancellationToken cancellationToken)
            {
                // Obtener usuarios y mensajes desde el repositorio para el usuario específico
                var users = await _userRepository.GetUsersWithMessages(request.UserId);

                return users;
            }
        }

    }
}
