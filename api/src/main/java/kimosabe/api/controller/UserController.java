package kimosabe.api.controller;

import kimosabe.api.entity.*;
import kimosabe.api.exception.IncorrectPasswordException;
import kimosabe.api.model.User;
import kimosabe.api.service.GroupService;
import kimosabe.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.session.Session;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
public class UserController {
    private UserService userService;
    private GroupService groupService;
    private FindByIndexNameSessionRepository<? extends Session> sessionRepository;

    @Autowired
    public UserController(
            UserService userService,
            GroupService groupService,
            FindByIndexNameSessionRepository<? extends Session> sessionRepository
    ) {
        this.userService = userService;
        this.groupService = groupService;
        this.sessionRepository = sessionRepository;
    }

    @PostMapping("/changePassword")
    @PreAuthorize("hasRole('ROLE_USER')")
    @ResponseStatus(HttpStatus.OK)
    public void changePassword(@RequestBody ChangePasswordRequestBody changePassword) {
        User user = userService.getUserByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        if (userService.checkPassword(user, changePassword.getOldPassword())) {
            userService.changePassword(user, changePassword.getNewPassword());
        } else {
            throw new IncorrectPasswordException();
        }
    }

    @PostMapping("/friends")
    @PreAuthorize("hasRole('ROLE_USER')")
    @ResponseStatus(HttpStatus.OK)
    public void requestFriend(@RequestBody FriendInviteRequestBody friendInvite) {
        String user = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.createFriendRequest(user, friendInvite);
    }

    @PutMapping("/friends")
    @PreAuthorize("hasRole('ROLE_USER')")
    @ResponseStatus(HttpStatus.OK)
    public void answerFriendRequest(@RequestBody FriendAnswerRequestBody friendAnswer) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        userService.acceptFriendRequest(username, friendAnswer);
    }

    @GetMapping("/sessions")
    @PreAuthorize("hasRole('ROLE_USER')")
    @ResponseStatus(HttpStatus.OK)
    public void getSessions(Principal principal) {
        String user = principal.getName();
        Collection<? extends Session> usersSessions = this.sessionRepository.findByPrincipalName(user).values();
        System.out.println(usersSessions.size());
    }

    @GetMapping("/profile/{username}")
    @ResponseStatus(HttpStatus.OK)
    public UserInfo getUserInfo(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return new UserInfo(user);
    }

    @GetMapping("/profile/{username}/friends")
    @ResponseStatus(HttpStatus.OK)
    public Set<UserInfo> getAllFriends(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return user.getFriends().stream().map(UserInfo::new).collect(Collectors.toSet());
    }

    @GetMapping("/profile/{username}/groups")
    @ResponseStatus(HttpStatus.OK)
    public Set<GroupInfo> getAllGroups(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return user.getGroups().stream()
                .map(group -> groupService.getGroupInfo(group.getGroupId())).collect(Collectors.toSet());
    }
}